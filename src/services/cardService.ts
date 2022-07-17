import { Card } from "@prisma/client";
import * as cardRepository from "../repositories/cardRepository.js";
import Cryptr from "cryptr";
import dotenv from "dotenv";
dotenv.config();

export type cardData = Omit<Card, "id">;

export async function createCardService(cardInfo: cardData, user) {
    const card = await cardRepository.findByTittle(cardInfo.tittle, user.id);
    if (card[0] === null) throw { type: 'CONFLICT', message: 'Nome de credencial já utilizado.' };
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const cryptPassword = cryptr.encrypt(cardInfo.password);
    const cryptCVC = cryptr.encrypt(cardInfo.cvc);
    await cardRepository.create({ ...cardInfo, userId: user.id, password: cryptPassword, cvc: cryptCVC });
}

export async function getCardService(user: any) {
    return await cardRepository.find(user);
}

export async function getCardByIdService(id: number, user: any) {
    return await cardRepository.findById(id, user)
}

export async function deleteCardService(id: number, user: any) {
    const result = await cardRepository.deleteById(id, user);
    if (result.count === 0) throw { type: 'NOT_FOUND', message: 'Cartão já excluido ou não existe' };
}