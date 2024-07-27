import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpCreateUserRequestDto, HttpCreateUserResponseDto } from '../dtos/HttpCreateUserDto';
import { CreateUserUseCase } from '@identity-and-access/core/usecases/commands/CreateUserUseCase';
import { HttpChangePasswordRequestDto, HttpChangePasswordResponseDto } from '../dtos/HttpChangePasswordDto';
import { ChangePasswordUseCase } from '@identity-and-access/core/usecases/commands/ChangePasswordUseCase';
import { HttpAuth } from '@shared/presentation/http/decorators/HttpAuth';
import { HttpUser } from '@shared/presentation/http/decorators/HttpUser';
import { HttpUpdateUserProfileRequestDto, HttpUpdateUserProfileResponseDto } from '../dtos/HttpUpdateUserProfileDto';
import { UpdateUserProfileUseCase } from '@identity-and-access/core/usecases/commands/UpdateUserProfileUseCase';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserDetailsUseCase } from '@identity-and-access/core/usecases/queries/GetUserDetailsUseCase';
import { GetUserDetailsResponseDto } from '@identity-and-access/core/usecases/queries/dtos/GetUserDetailsDto';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { HttpGetUserDetailsResponseDto } from '../dtos/HttpGetUserDetailsDto';
import { HttpUserProps } from '@shared/presentation/http/types/HttpUserTypes';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUserCase: CreateUserUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
        private readonly getUserDetailsUseCase: GetUserDetailsUseCase,
    ) {}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'This API is used for creating a new user account' })
    @ApiResponse({ status: HttpStatus.CREATED, type: HttpCreateUserResponseDto })
    public async createUser(@Body() body: HttpCreateUserRequestDto): Promise<HttpCreateUserResponseDto> {
        await this.createUserUserCase.execute(body);

        return HttpResponseDto.success({ message: 'User created successfuly!' });
    }

    @Patch('change-password')
    @HttpAuth()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'This API is used for changing user password' })
    @ApiResponse({ status: HttpStatus.OK, type: HttpChangePasswordResponseDto })
    public async changeUserPassword(
        @Body() body: HttpChangePasswordRequestDto,
        @HttpUser() user: HttpUserProps,
    ): Promise<HttpChangePasswordResponseDto> {
        const dto: HttpChangePasswordRequestDto = HttpChangePasswordRequestDto.create({ ...body, userId: user.id });

        await this.changePasswordUseCase.execute(dto);

        return HttpResponseDto.success({ message: 'User password changed successfuly!' });
    }

    @Patch('update-profile')
    @HttpAuth()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('profilePicture'))
    @ApiOperation({ summary: 'This API is used for updating user profile' })
    @ApiResponse({ status: HttpStatus.OK, type: HttpUpdateUserProfileResponseDto })
    public async updateUserProfile(
        @HttpUser() user: HttpUserProps,
        @Body() body: HttpUpdateUserProfileRequestDto,
        @UploadedFile() profilePicture?: Express.Multer.File,
    ): Promise<HttpUpdateUserProfileResponseDto> {
        const dto: HttpUpdateUserProfileRequestDto = HttpUpdateUserProfileRequestDto.create({
            ...body,
            ...(body.dateOfBirth && { dateOfBirth: new Date(body.dateOfBirth) }),
            ...(body.preferredLearningTimes && {
                // TODO: Transaform preffered learning times and remove this type assertion.
                preferredLearningTimes: (body.preferredLearningTimes as unknown as string)
                    .split(',')
                    ?.map((plt) => new Date(plt)),
            }),
            ...(profilePicture && {
                profilePicture: {
                    buffer: profilePicture.buffer,
                    originalname: profilePicture.originalname,
                    mimetype: profilePicture.mimetype,
                },
            }),
            userId: user.id,
        });

        await this.updateUserProfileUseCase.execute(dto);

        return HttpResponseDto.success({ message: 'User profile updated successfully!' });
    }

    @Get('me')
    @HttpAuth()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'This API is used for fetching user details, including user profile' })
    @ApiResponse({ status: HttpStatus.OK, type: HttpGetUserDetailsResponseDto })
    public async fetchMe(@HttpUser() user: HttpUserProps): Promise<HttpGetUserDetailsResponseDto> {
        const userDetails: GetUserDetailsResponseDto = await this.getUserDetailsUseCase.execute({ userId: user.id });

        return HttpResponseDto.success({ message: 'User details fetched successfully!', data: userDetails });
    }
}
