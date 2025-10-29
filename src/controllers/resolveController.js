const errorMessages = require('../enums/errorMessages');
const httpStatus = require('../enums/httpStatus');
const resolveService = require('../services/resolveService');

const resolveShortUrl = async (req, res) => {
    const { shortKey } = req.body;
    
    if (!shortKey) {
      return res.status(httpStatus.BAD_REQUEST).json({ 
        message: 'Short URL key is required' 
      });
    }
    
    try {
      const urlData = await resolveService.resolveShortUrl(shortKey);
      
      if (!urlData) {
        return res.status(httpStatus.NOT_FOUND).json({ 
          message: 'URL not found or has expired' 
        });
      }
      
      return res.status(httpStatus.OK).json(urlData);
    } catch (error) {
      console.error('error resolving url', error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: errorMessages.GENERIC_FAILURE });
    }
  };

module.exports = {
    resolveShortUrl
};
