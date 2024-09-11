const cron = require('node-cron');
const moment = require('moment');
const Task = require('../../models/taskModel');
const { mailPayload } = require('../email/emailPayload');

cron.schedule('*/30 * * * *', async () => {
  // console.log('Running the cron job to check pending tasks...');

  try {
    const tasks = await Task.find({ status: 'pending' }).populate('owner');

    for (const task of tasks) {
      if (!task.reminderSent) {
        const payload = {
          email: task.owner.email,
          name: task.owner.name,
          taskName: task.title,
          dueDate: moment(task.dueDate).format('MMMM D, YYYY'),
        };

        await mailPayload('task_reminder', payload); 
        console.log(`Reminder sent to owner for task: ${task.title}`);


        task.reminderSent = true;
        await task.save();
      }
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});
