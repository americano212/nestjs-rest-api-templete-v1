import { DocumentBuilder } from '@nestjs/swagger';

export class APIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('Service-Name API Docs')
      .setDescription(`Service-Name's REST API Document`)
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
  }
}
