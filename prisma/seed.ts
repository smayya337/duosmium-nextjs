import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	await prisma.organization.create({
		data: {
			orgName: 'public',
			name: 'Everyone'
		}
	});
	await prisma.organization.create({
		data: {
			orgName: 'users',
			name: 'Users'
		}
	});
	await prisma.organizationResultPolicy.create({
		data: {
			organization: {
				connectOrCreate: {
					where: {
						orgName: 'admin'
					},
					create: {
						orgName: 'admin',
						name: 'Administrators'
					}
				}
			},
			resultDuosmiumIdRegExp: '^.*$',
			create: true,
			read: true,
			update: true,
			delete: true,
			approve: true
		}
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
