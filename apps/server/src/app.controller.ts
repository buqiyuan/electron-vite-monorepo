import { Controller, Get, Render } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  @Render('index.hbs')
  root() {
    return { message: 'Hello world!' }
  }
}
