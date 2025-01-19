import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must include at least one uppercase letter.',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must include at least one number.',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must include at least one special character (@$!%*?&).',
  })
  password: string;
}
