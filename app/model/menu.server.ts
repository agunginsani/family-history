import { z } from "zod";
import { prisma } from "~/utils/db.server";

export function getMenus() {
  return prisma.menu.findMany();
}

export function deleteMenu(id: string) {
  return prisma.menu.delete({ where: { id } });
}

export const AddMenuDTOSchema = z.object({
  name: z.string(),
  path: z.string(),
});

type AddMenuDTO = z.infer<typeof AddMenuDTOSchema>;

export async function addMenu(payload: AddMenuDTO) {
  return prisma.menu.create({
    data: payload,
  });
}
