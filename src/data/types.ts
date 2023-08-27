import { SignalData } from "simple-peer";

export interface Convo {
    _id: string;
    name: string;
    conversation_members: [
      {
        _id: string;
        name: string;
        image: string;
        age: number;
        email: string;
        username: string;
        isOnline: boolean;
      }
    ];
    last_message: {
      from_user: {
        name: string;
        id: string;
      };
      user_image: string;
      message_text: string;
      message_media: {
        isMedia: string;
        type: string;
        file: string;
      };

      conversation_id: string;
      send_datetime: Date | string;
      is_seen: boolean;
    };
  }


 export interface Call {
    isRecievingCall: boolean;
    fromId: string;
    name: string;
    signal?: SignalData | string;
  }