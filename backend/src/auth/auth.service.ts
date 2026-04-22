import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

interface RegisterDto {
  organization: {
    name: string;
    subdomain: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.user.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if subdomain is taken
    const existingOrg = await this.prisma.organization.findUnique({
      where: { subdomain: data.organization.subdomain },
    });

    if (existingOrg) {
      throw new ConflictException('Subdomain already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.user.password, 10);

    // Create organization and user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.organization.name,
          subdomain: data.organization.subdomain,
          address: data.organization.address,
          city: data.organization.city,
          state: data.organization.state,
          zip: data.organization.zip,
          phone: data.organization.phone,
        },
      });

      const user = await tx.user.create({
        data: {
          email: data.user.email,
          password: hashedPassword,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: 'OWNER',
          organizationId: organization.id,
        },
      });

      return { organization, user };
    });

    // Generate token
    const token = this.jwtService.sign({
      sub: result.user.id,
      email: result.user.email,
      orgId: result.organization.id,
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        subdomain: result.organization.subdomain,
      },
      accessToken: token,
    };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        subdomain: user.organization.subdomain,
      },
      accessToken: token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }
}
