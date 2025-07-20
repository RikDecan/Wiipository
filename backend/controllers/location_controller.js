const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const LocationController = {
  getAll: async (req, res) => {
    // TODO✅: Implementeer de `getAll` methode.
    // Gebruik de volgende Prisma-query om alle locations op te halen:
    try {
        const locations = await prisma.location.findMany({
          orderBy: {
            city: "asc",
          },
        });
        // TODO✅: Zorg ervoor dat de methode alle locations teruggeeft als response als JSON.
      res.status(200).json(locations);
    } catch (locations) {
      res.status(500).json({error:  'Interne serverfout bij ophalen Locaties.'});
      }
    
    // TODO✅: Voeg foutafhandeling toe om mogelijke errors netjes af te handelen.
  },

  getById: async (req, res) => {
    // TODO✅: Voeg logica toe om `id` uit req.params op te halen.

        const {id} = req.params 

    // TODO✅: Gebruik de volgende Prisma-query:
    try {
        const location = await prisma.location.findUnique({
        where: { id: parseInt(id) },
        include: {
          properties: true,
        },
      });

      if (!location) {
        res.status(404).json({ error: 'Locatie niet gevonden.' });
      }

      res.status(200).json(location);
      
    } catch (error) {
      res.status(500).json({error: 'Interne serverfout bij ophalen Locaties.' })
    }

    // TODO✅: Check of location bestaat, anders return 404 error.
    // TODO✅: Return de location als JSON response.
    // TODO✅: Voeg foutafhandeling toe om mogelijke errors netjes af te handelen.
  },
};

module.exports = LocationController;