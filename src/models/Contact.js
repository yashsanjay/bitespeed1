const db = require("../config/database");

class Contact {
  static async findByEmailOrPhone(email, phoneNumber) {
    const [rows] = await db.query(
      `SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?`,
      [email, phoneNumber]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`SELECT * FROM Contact WHERE id = ?`, [id]);
    return rows[0];
  }

  static async create(email, phoneNumber, linkedId, linkPrecedence) {
    const [result] = await db.query(
      `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, ?)`,
      [email, phoneNumber, linkedId, linkPrecedence]
    );
    return result.insertId;
  }

  static async updateLinkedId(id, newLinkedId) {
    await db.query(`UPDATE Contact SET linkedId = ?, linkPrecedence = 'secondary' WHERE id = ?`, [
      newLinkedId,
      id,
    ]);
  }
}

module.exports = Contact;
