import profileImage from "@/assets/images/profile-image.png";
import team1 from "@/assets/images/team-1.png";
import team2 from "@/assets/images/team-2.png";
import team3 from "@/assets/images/team-3.png";
import team4 from "@/assets/images/team-4.png";

export const comments = [
  {
    id: 1,
    profileImage: profileImage,
    user: 'Andre Rio',
    date: '2:26 AM',
    replyTo: null,
    title: 'Hello, World!',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus sit ornare egestas habitant tellus eu. Eget eget viverra est felis mi faucibus. Morbi sagittis, duis tincidunt justo nec egestas condimentum lectus pellentesque. Enim potenti egestas enim eget. Sed sed vitae ut condimentum suspendisse. Risus id urna fermentum morbi donec. Lectus vitae vel, varius molestie gravida tincidunt sed vel porttitor. Metus, in duis eu consequat tortor amet, mus hendrerit. In tempor, malesuada at turpis amet tortor.',
    withShare: null
  },
  {
    id: 2,
    profileImage: team2,
    user: 'Jhone Shena',
    date: '4:26 AM',
    replyTo: '@andrerio_user1',
    message: '😍😍😍',
    withShare: null
  },
  {
    id: 3,
    profileImage: team1,
    user: 'Abanz Levana',
    date: '4:32 AM',
    replyTo: '@andrerio_user1',
    message: 'I really like this music',
    withShare: null
  },
  {
    id: 4,
    profileImage: team4,
    user: 'Xie Tzuyu',
    date: '5:26 AM',
    replyTo: '@andrerio_user1',
    message: 'I really like this music',
    withShare: null
  },
  {
    id: 5,
    profileImage: team1,
    user: 'Abanz Levana',
    date: '6:16 AM',
    replyTo: '@andrerio_user1',
    message: 'I think maybe you will like this music',
    withShare: {
      type: 'sound',
      data: {
        title: 'Cantina Band',
        sound:'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav',
        duration: 60
      } 
    }
  },
  {
    id: 6,
    profileImage: team3,
    user: 'Xie Tzuyu',
    date: '5:26 AM',
    replyTo: '@andrerio_user1',
    message: 'I really like this music',
    withShare: null
  },
  
]