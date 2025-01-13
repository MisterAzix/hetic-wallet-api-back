import * as bcrypt from 'bcrypt';

const saltRounds = 10;
export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

