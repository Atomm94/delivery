import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as moment from 'moment';
import firebaseNotification from '../models/auth/firebase/firebase.notification';

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry
  ) {}

  async addNotification(name: string, cronTime?: string, messageData?: {
    token: string,
    title: string,
    body: string
  }, timeConfig?: { date: Date, minutes: number, beforeOrAfter: 'before' | 'after' }) {
    let scheduledTime = cronTime;

    if (timeConfig) {
      let resultDate: any;
      const date = timeConfig.date;
      console.log(date);
      if (timeConfig.beforeOrAfter === 'before') {
        resultDate = moment.utc(date).subtract(30, 'minutes');
      } else {
        resultDate = moment.utc(date).add(30, 'minutes');
      }

      console.log('resultDate:');
      console.log(resultDate);
      scheduledTime = `${resultDate.minute()} ${resultDate.hour()} ${resultDate.date()} ${resultDate.month() + 1} *`;
    }

    if (messageData) {
      try {

        const { token, title, body } = messageData;

        await this.addNewCronJob(name, scheduledTime, () => firebaseNotification(token, title, body) );
        console.log(`Sent notification for job ${name}`);
      } catch (error) {
        console.error(`Error sending notification for job ${name}: ${error}`);
      }
    }

    console.log(`Added cron job ${name} with schedule: ${scheduledTime}`);
  }

  async addNewCronJob(name: string, cronTime: string, handler: () => Promise<any>) {
    const job = new CronJob(cronTime, async () => {
      try {
        console.log(`Running job ${name} at ${new Date().toISOString()}`);
        await handler();
        this.deleteCronJob(name);
      }catch (error) {
        this.deleteCronJob(name);
      }
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }
  
  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    console.log(`Deleted cron job ${name}`);
  }

  listCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((_, key) => console.log(`Cron Job: ${key}`));
  }
}