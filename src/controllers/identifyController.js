const { identifyContact } = require("../services/identifyService");

async function identify(req, res) {
  try {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
      return res.status(400).json({ message: "Email or phoneNumber is required" });
    }

    const contact = await identifyContact(email, phoneNumber);
    res.status(200).json({ contact });
  } catch (error) {
    console.error("Error identifying contact:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { identify };
