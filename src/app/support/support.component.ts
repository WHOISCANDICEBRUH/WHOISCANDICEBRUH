import { Component, OnInit } from '@angular/core';
import { EmailService, email, emailingStatus } from '../services/email.service';

declare var mixitup: any;
declare var $: any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  private _$: any;
  private _mixitup: any;
  private mixerInitialized = false;

  constructor(
    private emailService: EmailService
    ) {
    this._$ = $;
    this._mixitup = mixitup;
  }

  ngOnInit() {
  }

  ngAfterViewChecked(){

    if (this._$('.markLastMixerItem').length > 0) {
      this.initMixer();
    }
  }
  initMixer ()
  {
    if (this.mixerInitialized) return;
    this._mixitup ('.mix-grid');
    this.mixerInitialized = true;
  }

  email: email = new email();
  emailSubmitted = false;
  emailingStatus = emailingStatus.newMail;

  onSubmitEmail() {
    this.emailingStatus = emailingStatus.sending;
    var compiledSubject = `[inquery from Support] from ${this.email.userName}`;;
    var compiledBody = `
!!! DO NOT REPLY DIRECTLY, USE THE USER'S ADDRESS BELOW TO REPLY. !!!
From: ${this.email.userName}
Address: ${this.email.userAddress}
Requested from page: ${window.location}
Body:
${this.email.body}
    `;

    this.emailService.sendInqueryMail(this.email.userName, this.email.userAddress, compiledSubject, compiledBody)
      .subscribe(
        result =>{
          this.emailingStatus = emailingStatus.sent;
        },
        error => {
          console.error(error);
          this.emailingStatus = emailingStatus.failed;
        }
        );
  }

  onCreateNewEmail()
  {
    this.email = new email();
    this.emailingStatus = emailingStatus.newMail;
  }

  onTrySendAgain()
  {
    this.emailingStatus = emailingStatus.newMail;
  }
}

