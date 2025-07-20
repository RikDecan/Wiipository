const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const PropertyController = {
  getAll: async (req, res) => {
    // TODO✅: Implementeer de `getAll` methode.
    // Gebruik de volgende Prisma-query om alle properties op te halen:
    try {
      const properties = await prisma.property.findMany({
        include: {
          location: true,
          propertyType: true,
          images: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      
      res.status(200).json(properties);

    } catch (error) {
      res.status(500).json({ error: 'Interne serverfout bij ophalen eigendommen.' });
    }
    // TODO✅: Zorg ervoor dat de methode alle properties teruggeeft als response als JSON.
    // TODO✅: Voeg foutafhandeling toe om mogelijke errors netjes af te handelen.
  },

  getById: async (req, res) => {
    // TODO✅: Voeg logica toe om `id` uit req.params op te halen.

    const {id} = req.params 

    try {
      // TODO✅: Gebruik de volgende Prisma-query:
      const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
        include: {
          location: true,
          propertyType: true,
          images: true,
          agent: true,
        },
      });
      // TODO✅: Check of property bestaat, anders return 404 error.
   if (!property) {
      return res.status(404).json({ error: 'Eigendom niet gevonden.' });
    }
    
    // TODO✅: Zorg ervoor dat de property wordt teruggegeven als JSON response.
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Interne serverfout bij ophalen eigendom.' });
  }

    // TODO✅: Voeg foutafhandeling toe om mogelijke errors netjes af te handelen.
  },

  getFeatured: async (req, res) => {
    // TODO✅: Implementeer de `getFeatured` methode.
    // Gebruik de volgende Prisma-query:

    try {
      const properties = await prisma.property.findMany({
        where: { featured: true },
        include: {
          location: true,
          images: true,
        },
        take: 6,
      });
      
      // TODO✅: Return de featured properties als JSON response.
      res.status(200).json(properties);

    } catch (error) {
      res.status(500).json({ error: 'Interne serverfout bij ophalen Featured.' });
    }

    // TODO✅: Voeg foutafhandeling toe om mogelijke errors netjes af te handelen.
  },
};

module.exports = PropertyController;