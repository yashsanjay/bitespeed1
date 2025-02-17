const Contact = require("../models/Contact");

async function identifyContact(email, phoneNumber) {
  let contacts = await Contact.findByEmailOrPhone(email, phoneNumber);

  if (contacts.length === 0) {
    // No existing contacts, create new primary contact
    const newContactId = await Contact.create(email, phoneNumber, null, "primary");
    return {
      primaryContactId: newContactId,
      emails: email ? [email] : [],
      phoneNumbers: phoneNumber ? [phoneNumber] : [],
      secondaryContactIds: [],
    };
  }

  // Find primary contact
  let primaryContact = contacts.find((c) => c.linkPrecedence === "primary") || contacts[0];

  // Ensure all contacts are linked
  for (const contact of contacts) {
    if (contact.id !== primaryContact.id && contact.linkedId !== primaryContact.id) {
      await Contact.updateLinkedId(contact.id, primaryContact.id);
    }
  }

  // Check if new data needs to be stored
  const newData = !contacts.some((c) => c.email === email && c.phoneNumber === phoneNumber);
  if (newData) {
    await Contact.create(email, phoneNumber, primaryContact.id, "secondary");
  }

  // Re-fetch updated contacts
  contacts = await Contact.findByEmailOrPhone(email, phoneNumber);
  const emails = [...new Set(contacts.map((c) => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(contacts.map((c) => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = contacts
    .filter((c) => c.linkPrecedence === "secondary")
    .map((c) => c.id);

  return {
    primaryContactId: primaryContact.id,
    emails,
    phoneNumbers,
    secondaryContactIds,
  };
}

module.exports = { identifyContact };
