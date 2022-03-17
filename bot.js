require('dotenv').config()

const { text } = require('express')
const puppeteer = require('puppeteer')
const services = require('./service')

const CHATB0X_SELECTOR = process.env.CHAT_BOX
const INVALID_SELECTOR = process.env.POP_UP_INVALID

function setDelay(milisec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, milisec)
  })
}

async function targetContact(page, wa_no) {
  try {
    const target = await page.goto(
      `https://web.whatsapp.com/send?phone=${wa_no}&text&app_absent=0`,
    )
  } catch (e) {
    console.log('error whatsapp number')
  }

  return
}

async function writeMessage(page, seq, wa_no, wa_text) {
  try {
    const inp = await page.waitForSelector(CHATB0X_SELECTOR)
    await inp.type(wa_text)
    const text = await page.evaluate((inp) => inp.textContent, inp)
    if (text != null) {
      if (text != wa_text) {
        await page.keyboard.press('Enter')
        await services.updateStatusFailed(seq, wa_no)
      }

      if (text == wa_text) {
        await page.keyboard.press('Enter')
        await services.updateStatusSuccess(seq, wa_no)
      }
    }
  } catch (e) {
    const invalid_popup_select = await page.waitForSelector(INVALID_SELECTOR)
    const invalid_popup = await page.evaluate(
      (invalid_popup_select) => invalid_popup_select.textContent,
      invalid_popup_select,
    )

    // check number invalid
    if (invalid_popup == 'Phone number shared via url is invalid.') {
      console.log(`nomor ${wa_no} invalid`)
      await services.updateStatusInvalidNumber(seq, wa_no)
    }
    console.log('FAIL: belum selesai ketik')
    return
  }

  return
}

async function scrape(url) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: 'CACHE', // Folder to save cache web.whatsapp
  })
  const page = await browser.newPage()
  await page.goto(url)

  while (true) {
    const contacts = await services.getOutboxData()

    // filtered targetting contact from outbox
    const filtered_contacts = contacts.map((contact) => ({
      seq: contact.id,
      wa_no: contact.wa_no,
      wa_text: contact.wa_text,
    }))

    if (filtered_contacts != null) {
      for (let i = 0; i < filtered_contacts.length; i++) {
        await targetContact(page, filtered_contacts[i].wa_no)
        await writeMessage(
          page,
          filtered_contacts[i].seq,
          filtered_contacts[i].wa_no,
          filtered_contacts[i].wa_text,
        )
        await setDelay(4000) // set delay after send message in milisecond
      }
    }
  }
}

scrape('https://web.whatsapp.com')
