import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokensDto } from 'dtos/minToken.dto';
import { VoteProposal } from 'dtos/voteProposal.dto';
import { SelfDelegate } from 'dtos/selfDelegate.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-address')
  getTokenAddress(): any {
    return this.appService.getTokenAddress();
  }
  @Get('get-total-supply')
  getTotalSupply(): Promise<bigint> {
    return this.appService.getTotalSupply();
  }

  @Get('get-token-balance/:address')
  getBalance(@Param('address') address: string): Promise<bigint> {
    return this.appService.getTokenBalance(address);
  }

  @Post('mint-tokens')
  mintTokens(@Body() body: MintTokensDto): Promise<any> {
    return this.appService.mintTokens(body.address);
  }
  @Post('self-delegate')
  selfDelegate(@Body() body: SelfDelegate): Promise<any> {
    return this.appService.selfDelegate(body.address);
  }
  @Post('vote-proposal')
  vote(@Body() body: VoteProposal): Promise<any> {
    return this.appService.vote(body.proposal, body.amount);
  }
  @Get('get-winner')
  getWinningProposal(): Promise<any> {
    return this.appService.getWinningProposal();
  }
}
