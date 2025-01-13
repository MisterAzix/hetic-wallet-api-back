import * as bcrypt from 'bcrypt';

const saltRounds = 10;
export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

/**
 * Exemple d'utilisation des fonctions :
 * 
 * async function exampleUsage() {
 *   const password = 'monMotDePasse';
 *   const hashedPassword = await hashPassword(password);
 *   console.log('Hashed Password:', hashedPassword);
 * 
 *   const isMatch = await comparePassword(password, hashedPassword);
 *   console.log('Password Match:', isMatch); // Devrait afficher 'true'
 * }
 * 
 * exampleUsage();
 */