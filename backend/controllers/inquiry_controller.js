const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const InquiryController = {
  create: async (req, res) => {
    // TODO✅: Voeg logica toe om `propertyId`, `name`, `email`, en `message` uit req.body op te halen.
    const propertyId = req.body.propertyId;
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message

    // 🌟KAN OOK OP DEZE MANIER🌟 const { propertyId, name, email, message } = req.body; 

    
    // TODO✅: Voeg foutafhandeling toe om mogelijke errors netjes af te handelen.
    try {
      // TODO✅: Gebruik de volgende Prisma-query om een nieuwe inquiry aan te maken:
      const newInquiry = await prisma.inquiry.create({
        data: {
          propertyId: parseInt(propertyId),
          name,
          email,
          message,
        },
      });      
      // TODO✅: Return de aangemaakte inquiry met status 201.
      res.status(201).json(newInquiry);

    } catch (error) {
    res.status(500).json({ error: 'Interne serverfout bij aanmaken aanvraag.' });
    }
  },

  getAll: async (req, res) => {
    // TODO✅: Implementeer de `getAll` methode.
    // Gebruik de volgende Prisma-query:
    try {
      const inquiry = await prisma.inquiry.findMany({
        include: {
          property: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      
      res.status(200).json(inquiry);
    } catch (error) {
      res.status(500).json({ error: 'Interne serverfout bij ophalen aanvraag.' });
    }
    // TODO✅: Return alle inquiries als JSON response.
    // TODO✅: Voeg foutafhandeling toe om mogelijke errors netjes af te handelen.
  },
};

module.exports = InquiryController;