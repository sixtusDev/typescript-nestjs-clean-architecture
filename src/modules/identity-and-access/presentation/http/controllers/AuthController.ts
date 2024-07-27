import { Controller, Post, HttpCode, HttpStatus, Req, UseGuards, Body, Patch, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { HttpAuthService, HttpLoggedInUser } from '../auth/HttpAuthService';
import { HttpLoginUserRequestDto, HttpLoginUserResponseDto } from '../dtos/HttpLoginUserDto';
import { HttpLocalAuthGuard } from '../auth/guards/HttpLocalAuthGuard';
import {
    HttpInitiateResetPasswordRequestDto,
    HttpInitiateResetPasswordResponseDto,
} from '../dtos/HttpInitiateResetPasswordDto';
import { InitiateResetPasswordUseCase } from '@identity-and-access/core/usecases/commands/InitiateResetPasswordUseCase';
import { HttpResetPasswordRequestDto, HttpResetPasswordResponseDto } from '../dtos/HttpResetPasswordDto';
import { ResetPasswordUseCase } from '@identity-and-access/core/usecases/commands/ResetPasswordUseCase';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { HttpVerifyEmailRequestDto, HttpVerifyEmailResponseDto } from '../dtos/HttpVerifyEmailDto';
import { VerifyEmailUseCase } from '@identity-and-access/core/usecases/commands/VerifyEmailUseCase';
import { HttpRequestWithUser } from '@shared/presentation/http/types/HttpUserTypes';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: HttpAuthService,
        private readonly initiateResetPasswordUseCase: InitiateResetPasswordUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase,
        private readonly verifyUserEmailUseCase: VerifyEmailUseCase,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(HttpLocalAuthGuard)
    @ApiBody({ type: HttpLoginUserRequestDto })
    @ApiOperation({ summary: 'This API is used for authenticatiog users' })
    @ApiResponse({ status: HttpStatus.OK, type: HttpLoginUserResponseDto })
    public async login(@Req() request: HttpRequestWithUser): Promise<HttpLoginUserResponseDto> {
        const loggedInUser: HttpLoggedInUser = this.authService.login(request.user);

        return HttpResponseDto.success({ message: 'User logged in successfully!', data: loggedInUser });
    }

    @Post('initiate-reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'This API is used for initiating a reset password - Reset password instruction is sent to the user',
    })
    @ApiResponse({ status: HttpStatus.OK, type: HttpInitiateResetPasswordResponseDto })
    public async initiateResetPassword(
        @Body() body: HttpInitiateResetPasswordRequestDto,
    ): Promise<HttpInitiateResetPasswordResponseDto> {
        await this.initiateResetPasswordUseCase.execute(body);

        return HttpResponseDto.success({ message: 'Reset password instructions successfully sent to your email!' });
    }

    @Patch('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'This API is used for resetting user password after they receive a reset password instruction mail',
    })
    @ApiResponse({ status: HttpStatus.OK, type: HttpResetPasswordResponseDto })
    public async resetPassword(@Body() body: HttpResetPasswordRequestDto): Promise<HttpResetPasswordResponseDto> {
        await this.resetPasswordUseCase.execute(body);

        return HttpResponseDto.success({ message: 'Password reset successfully!' });
    }

    @Get('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'This API is used for verifying user email' })
    @ApiResponse({ status: HttpStatus.OK, type: HttpVerifyEmailResponseDto })
    public async verifyUserEmail(@Query() query: HttpVerifyEmailRequestDto): Promise<HttpVerifyEmailResponseDto> {
        await this.verifyUserEmailUseCase.execute(query);

        return HttpResponseDto.success({ message: 'User email verified successfuly!' });
    }
}
