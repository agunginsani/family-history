import { z } from "zod";
import { prisma } from "~/utils/db.server";

export function getRoleMenus() {
  return prisma.roleMenu.findMany({ include: { menu: true, role: true } });
}

export function getRoleMenu(id: string) {
  return prisma.roleMenu.findFirstOrThrow({
    where: { id },
    include: { role: true, menu: true },
  });
}

export function deleteRoleMenu(id: string) {
  return prisma.roleMenu.delete({ where: { id } });
}

export const AddRoleMenuDTOSchema = z.object({
  roleId: z.string().uuid(),
  menuId: z.string().uuid(),
});

type AddRoleMenuDTO = z.infer<typeof AddRoleMenuDTOSchema>;

export function addRoleMenu(payload: AddRoleMenuDTO) {
  return prisma.roleMenu.create({
    data: payload,
  });
}

export const EditRoleMenuDTOSchema = z.object({
  id: z.string().uuid(),
  roleId: z.string().uuid(),
  menuId: z.string().uuid(),
});

type EditRoleMenuDTO = z.infer<typeof EditRoleMenuDTOSchema>;

export function editRoleMenu({ id, ...payload }: EditRoleMenuDTO) {
  return prisma.roleMenu.update({
    where: { id },
    data: payload,
  });
}

export async function getMenusByRole(roleId: string) {
  const roleMenus = await prisma.roleMenu.findMany({
    where: { roleId },
    include: { menu: true },
  });
  return roleMenus.map((roleMenu) => roleMenu.menu);
}
