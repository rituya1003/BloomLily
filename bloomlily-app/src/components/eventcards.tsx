import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig"; // Firestoreの設定を正しくインポート
import './eventcards.css';
 


interface EventRequest {
  userId: string;
  event_name: string;
  venue: string;
  event_time: { start: any; end: any };
  tags: string[];
  design_image_url: string;
  comment: string;
  genre: number;
}

// FirestoreタイムスタンプをDateオブジェクトに変換する関数
const convertTimestampToDate = (timestamp: any) => {
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return null;
};

const EventCards: React.FC = () => {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);

  useEffect(() => {
    const fetchEventRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'enentRewuests'));
        const data = querySnapshot.docs.map((doc) => doc.data() as EventRequest);
        console.log(data);
        setEventRequests(data);
      } catch (error) {
        console.error("Error fetching event requests:", error);
      }
    };

    fetchEventRequests();
  }, []);

  return (
    <div className="event-cards">
      {eventRequests.map((event, index) => (
        <div key={index} className="event-card">
          <div className="account-info">
            <span className="account-name">{event.userId}</span>
            <span className={`badge ${event.genre === 0 ? 'organizer' : 'artist'}`}>
              {event.genre === 0 ? '主催' : '絵師募集'}
            </span>
          </div>
          <p className="event-title"><span className="p-size">公演名</span>: {event.event_name}</p>
          <p className="venue"><span className="p-size">会場</span>: {event.venue}</p>
          <p className="date">
          <span className="p-size">公演日</span>: {convertTimestampToDate(event.event_time.start)?.toLocaleDateString()} ~ {convertTimestampToDate(event.event_time.end)?.toLocaleDateString()}
          </p>
          <div className="tags">
            {event.tags.map((tag, idx) => (
              <span key={idx} className="tag">#{tag}</span>
            ))}
          </div>
          <img src={event.design_image_url} alt="デザイン画像" className="design-image" />
          <p className="comment">{event.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default EventCards;
