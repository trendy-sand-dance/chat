import { RoomType } from "./types";

export default class MessageStorage {

  private _roomMessages : Map<RoomType, RoomMessage> = new Map<RoomType, RoomMessage>();
  private _whisperMessages : WhisperMessage[] = [];
  private _invitationMessages : InvitationMessage[] = [];
   
  public constructor() {

  }

  // Getters

  // GetAllMessagesExcept
  //
  // GetAllMessagesFromRoom() {
  //  filter fetch(db/getBlockedUsers/:id);
  //  returns messages (xcept for the blocked)
  // }
  //
  // GetNumMessagesFromRoom
  // GetWhisperMessagesFrom(userId, targetId);
  



}
