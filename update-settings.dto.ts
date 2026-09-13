import { IsBoolean, IsInt, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional() @IsString() siteName?: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsString() faviconUrl?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() domain?: string;

  @IsOptional()
  @Matches(/^#([0-9A-Fa-f]{6})$/, { message: 'primaryColorHex harus format hex, mis. #E11D48' })
  primaryColorHex?: string;

  @IsOptional() @IsString() bgType?: 'none' | 'image' | 'video';
  @IsOptional() @IsString() bgUrl?: string;
  @IsOptional() @IsString() bgMode?: 'repeat' | 'cover' | 'fixed' | 'blur';
  @IsOptional() @IsString() themeMode?: 'dark' | 'light' | 'auto';
  @IsOptional() @IsString() containerWidth?: string;
  @IsOptional() @IsString() cardRadius?: string;
  @IsOptional() @IsBoolean() animationsOn?: boolean;

  @IsOptional() @IsString() defaultServer?: string;
  @IsOptional() @IsBoolean() autoplay?: boolean;
  @IsOptional() @IsInt() skipIntroSeconds?: number;

  @IsOptional() @IsBoolean() commentsEnabled?: boolean;
  @IsOptional() @IsBoolean() bookmarkEnabled?: boolean;
  @IsOptional() @IsBoolean() scheduleEnabled?: boolean;

  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDescription?: string;
  @IsOptional() @IsString() gaId?: string;
}
