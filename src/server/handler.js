const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { confidenceScore, label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const finalLabel = confidenceScore < 50 ? 'non-cancer' : label;

 
  const data = {
    "id": id,
    "result": finalLabel,
    "suggestion": suggestion,
    "createdAt": createdAt
  }

  const response = h.response({
    status: 'success',
    message: confidenceScore > 50 ? 'Model is predicted successfully : Cancer' : 'Model is predicted successfully : Non-cancer',
    data
  })
  response.code(201);
  return response;
}
 
module.exports = postPredictHandler;