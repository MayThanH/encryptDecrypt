import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EncryptionService } from './encryption.service';

@ApiTags('encryption')
@Controller()
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('get-decrypt-data')
  @ApiBody({ schema: { example: { data1: 'string', data2: 'string' } } })
  @ApiResponse({ status: 201, description: 'The decrypted data' })
  getDecryptData(@Body() body: { data1: string; data2: string }) {
    const { data1, data2 } = body;
    if (!data1 || !data2) {
      return { successful: false, error_code: 'Invalid data', data: null };
    }
    const payload = this.encryptionService.decryptData(data1, data2);
    return { successful: true, error_code: '', data: { payload } };
  }

  @Post('get-encrypt-data')
  @ApiBody({ schema: { example: { payload: 'string' } } })
  @ApiResponse({ status: 201, description: 'The encrypted data' })
  getEncryptData(@Body() body: { payload: string }) {
    const { payload } = body;
    if (!payload || payload.length > 2000) {
      return { successful: false, error_code: 'Invalid payload', data: null };
    }
    const data = this.encryptionService.encryptData(payload);
    return { successful: true, error_code: '', data };
  }
}
