import {NextRequest} from "next/server";
import {prisma} from "@/app/lib/global/prisma";

async function resultPermissions(userID: string, result: string) {
    const memberships = await prisma.membership.findMany({
        where: {
            userId: userID
        },
        select: {
            organizationId: true
        }
    });
    const [userPolicies, organizationPolicies] = await prisma.$transaction([
        prisma.userResultPolicy.findMany({
            where: {
                userId: userID
            },
            select: {
                resultDuosmiumIdRegExp: true,
                create: true,
                read: true,
                update: true,
                delete: true
            }
        }),
        prisma.organizationResultPolicy.findMany({
            where: {
                organizationId: {
                    in: memberships.map(i => i.organizationId)
                }
            },
            select: {
                resultDuosmiumIdRegExp: true,
                create: true,
                read: true,
                update: true,
                delete: true
            }
        })
    ]);
    let allPolicies = [];
    allPolicies.push(...userPolicies, ...organizationPolicies);
    allPolicies = allPolicies.filter(i => result?.match(new RegExp(i.resultDuosmiumIdRegExp)));
    let createRule = false;
    let readRule = false;
    let updateRule = false;
    let deleteRule = false;
    let createApprovalRule = false;
    let readApprovalRule = false;
    let updateApprovalRule = false;
    let deleteApprovalRule = false;
    for (const pol of allPolicies) {
        createRule = createRule || pol.create;
        readRule = readRule || pol.read;
        updateRule = updateRule || pol.update;
        deleteRule = deleteRule || pol.delete;
        createApprovalRule = createApprovalRule || pol.createApproval;
        readApprovalRule = readApprovalRule || pol.readApproval;
        updateApprovalRule = updateApprovalRule || pol.updateApproval;
        deleteApprovalRule = deleteApprovalRule || pol.deleteApproval;

    }
    return [createRule, readRule, updateRule, deleteRule, createApprovalRule, readApprovalRule, updateApprovalRule, deleteApprovalRule];
}
