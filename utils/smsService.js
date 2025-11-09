import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const sendSmsToAgencies = async (incident) => {
  const agencies = ['+234XXXXXXXXXX']; // Fire, NEMA, etc.

  const messages = agencies.map(phone =>
    client.messages.create({
      body: `🚨 ${incident.type.toUpperCase()} reported at ${incident.location.address}`,
      from: process.env.TWILIO_PHONE,
      to: phone
    })
  );

  await Promise.all(messages);
};
