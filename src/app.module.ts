import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GITHUB_SERVICE, githubService } from './apis/github/github.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: GITHUB_SERVICE,
      useValue: githubService()
    }
  ],
})
export class AppModule {}
