const path = require('path')
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid');

const pug = require('pug');
const juice = require('juice');

let transporter = null;

if(process.env.NODE_ENV === 'production') {
  transporter = nodemailer.createTransport(
    sendgrid({
        apiKey: process.env.SENDGRID_API
    })
  );
} else {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
}

exports.sendEmail = async (data) => {
  try {
    //data {template'', template_data{}, mail_details{from, to,subject, replyto,bcc}, attachments[]}
    const emailtemplate = await _generateHTML(data.template, data.template_data);
    let options = {
      from: data.mail_details.from ? data.mail_details.from : process.env.SENDER_DOMAIN_DEFAULT,
      to: data.mail_details.to,
      subject: data.mail_details.subject,
      html: emailtemplate,
      category: data.mail_details.company ? data.mail_details.company : process.env.COMPANY_DEFAULT
    };
    if (data.mail_details.cc) {
      options.cc = data.mail_details.cc;
    }
    if (data.mail_details.bcc) {
      options.cc = data.mail_details.bcc;
    }
    if (data.mail_details.replyTo) {
      options.replyTo = data.mail_details.replyTo;
    }
    let arr = data.attachments;
    if (Array.isArray(arr) && arr.length) {
      const allattachments = await _buildBillAttachments(data.attachments);
      options.attachments = allattachments;
    }
    const sendMail = await transporter.sendMail(options);
    return true;
  } catch (err) {
    throw err;
  }
}

//Generate template file
const _generateHTML = async (filename, options) => {
  try {
    let datosmail = {};
    if (options) {
      datosmail = options;
    }
    const url_file = path.join(__dirname, `../views/emails/${filename}.pug`);
    const html = pug.renderFile(url_file, datosmail);
    const inlined = juice(html);
    return inlined;
  } catch (err) {
    throw err;
  }
}

/**
 * Generate finale attachment structure
 * @param [Array] data
 */
const _buildBillAttachments = (data) => {
  return new Promise ((resolve, reject)=> {
    let allattachments = [];
    for (let i = 0; i < data.length; i++) {
      allattachments.push(_buildFileAttachment(data.name, data.content));
    }
    resolve(allattachments);
  })
}

/**
 * Build file for attachment
 * @param {*} varfilename
 * @param {*} base64
 */
const _buildFileAttachment = (filename, base64) => {
  return { filename: filename, content: base64, encoding: 'base64' };
}