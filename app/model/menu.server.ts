import { z } from "zod";
import { prisma } from "~/utils/db.server";

export function getMenus() {
  return prisma.menu.findMany();
}

export function getMenu(id: string) {
  return prisma.menu.findFirstOrThrow({ where: { id } });
}

export function deleteMenu(id: string) {
  return prisma.menu.delete({ where: { id } });
}

export const AddMenuDTOSchema = z.object({
  name: z.string(),
  path: z.string(),
});

type AddMenuDTO = z.infer<typeof AddMenuDTOSchema>;

export const EditMenuDTOSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  path: z.string(),
});

type EditMenuDTO = z.infer<typeof EditMenuDTOSchema>;

export async function addMenu(payload: AddMenuDTO) {
  return prisma.menu.create({
    data: payload,
  });
}

export function editMenu({ id, ...payload }: EditMenuDTO) {
  return prisma.menu.update({ where: { id }, data: payload });
}
