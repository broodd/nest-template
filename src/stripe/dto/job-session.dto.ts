import { JobStatus, Job } from 'bull';

import { ApiProperty } from '@nestjs/swagger';

export class JobSessionDto {
  @ApiProperty({ type: String })
  state: 'not_found' | JobStatus | 'stuck';
  timestamp?: Job['timestamp'];
  returnValue?: Job['returnvalue'];
  failedReason?: Job['failedReason'];
}
