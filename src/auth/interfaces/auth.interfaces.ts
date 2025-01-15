export interface LoginDto {
	email: string;
	password: string;
}

export interface RegisterDto {
	email: string;
	password: string;
	passwordConfirm: string;
}

export interface ForgotPasswordDto {
	email: string;
}

export interface ResetPasswordDto {
	token: string;
	newPassword: string;
	passwordConfirm: string;
}

export interface Tokens {
	access_token: string;
	refresh_token: string;
}

export interface JwtPayload {
	sub: string;
	email: string;
}