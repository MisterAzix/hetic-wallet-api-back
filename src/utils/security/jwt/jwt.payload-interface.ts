export interface JwtPayload {
    sub: string; // ID de l'utilisateur ou de l'entité
    action: string; // Action spécifique (ex : "sign_transaction", "access_resource")
    data?: any; // Données supplémentaires (ex : ID de transaction, adresse blockchain)
  }