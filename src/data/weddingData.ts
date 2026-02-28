// Wedding Data - Easy to customize
export const weddingData = {
  // Couple Information
  groom: {
    fullName: 'Nguyễn Danh Thịnh',
    shortName: 'Danh Thịnh',
    initial: 'T',
    description: 'Là một chàng trai ấm áp, luôn yêu thương và coi trọng gia đình. Với Thịnh, gia đình không chỉ là điểm tựa mà còn là nơi gửi gắm mọi tình cảm chân thành nhất. Người luôn mang lại cảm giác an toàn và ấm cúng cho những ai ở bên.',
    image: '/images/groom.webp',
    bank: {
      name: 'NGUYEN DANH THINH',
      number: '1234567890',
      bankName: 'Vietcombank',
      qrCode: '/images/qr-groom.png',
    },
  },
  bride: {
    fullName: 'Phạm Thị Thuý Hằng',
    shortName: 'Thuý Hằng',
    initial: 'H',
    description: 'Là người thông minh, luôn vui vẻ và hay cười, mang đến không khí tươi sáng cho những người xung quanh. Cô ấy đôi khi tỏ ra bướng nhưng lại rất quan tâm và chăm sóc những người mình yêu thương, luôn biết cách thể hiện sự quan tâm một cách sâu sắc.',
    image: '/images/bride.webp',
    bank: {
      name: 'PHAM THI THUY HANG',
      number: '0987654321',
      bankName: 'Techcombank',
      qrCode: '/images/qr-bride.png',
    },
  },

  // Monogram
  monogram: 'T & H',

  // Wedding Date
  weddingDate: new Date('2025-01-11T11:00:00'),
  weddingDateDisplay: '11 tháng 01 2025',

  // Family Info
  groomFamily: {
    coPhu: 'Nguyễn Văn A',
    ba: 'Nguyễn Văn B',
    me: 'Trần Thị C',
  },
  brideFamily: {
    coPhu: 'Phạm Văn X',
    ba: 'Phạm Văn Y',
    me: 'Lê Thị Z',
  },

  // Wedding Intro
  intro: {
    title: 'Và.. Ngày ấy đã tới',
    content: 'Thật vui vì được gặp và đón tiếp các bạn trong một dịp đặc biệt - Ngày cưới của chúng mình. Chúng mình muốn gửi đến bạn những lời cảm ơn sâu sắc nhất và để bạn biết rằng chúng mình rất hạnh phúc khi thấy bạn ở đó. Cảm ơn các bạn rất nhiều vì sự hiện diện cùng những lời chúc tốt đẹp mà bạn đã dành cho chúng mình nha!',
  },

  // Story Timeline
  story: [
    {
      id: 1,
      date: '24/04/2017',
      title: 'Câu chuyện từ nụ cười...',
      content: 'Chúng mình đã bắt đầu từ những nụ cười mà hai đứa dành cho nhau. Chỉ từ những cái để ý nho nhỏ dành cho nhau trên trường học và câu chuyện tiếp tục bắt đầu từ đó...',
      image: '/images/story-1.webp',
      label: 'BẮT ĐẦU TỪ',
    },
    {
      id: 2,
      date: '15/06/2018',
      title: 'Hai đứa chính thức tìm hiểu nhau...',
      content: 'Lúc đó, mọi thứ thật sự rất nhẹ nhàng và trong sáng. Cả hai chỉ là những người bạn vô tình gặp gỡ, rồi dần dần có những cuộc trò chuyện kéo dài không dứt, những nụ cười cứ thế nở trên môi mỗi lần nhìn thấy nhau.',
      image: '/images/story-2.webp',
    },
    {
      id: 3,
      date: '11/01/2025',
      title: 'Ngày chung đôi',
      content: 'Gần 8 năm bên nhau, chúng ta đã cùng nhau vượt qua bao thử thách, chia sẻ những niềm vui, nỗi buồn, và những khoảnh khắc không thể quên. Tình yêu của chúng ta đã trưởng thành, vững vàng như một cây cổ thụ, ngày càng mạnh mẽ và bền chặt hơn qua từng ngày.',
      image: '/images/story-3.webp',
      label: 'và sau nữa',
    },
  ],

  // Wedding Events
  events: [
    {
      id: 1,
      name: 'Tiệc nhà trai',
      date: '2025-01-11',
      time: '11:00',
      timeDisplay: '11:00 AM',
      location: 'Tư gia nhà trai',
      address: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
      description: 'Tiệc cưới tại nhà trai',
    },
    {
      id: 2,
      name: 'Tiệc nhà gái',
      date: '2025-01-10',
      time: '17:00',
      timeDisplay: '17:00 PM',
      location: 'Tư gia nhà gái',
      address: '456 Đường DEF, Quận UVW, TP. Hồ Chí Minh',
      description: 'Tiệc cưới tại nhà gái',
    },
    {
      id: 3,
      name: 'Lễ Thành Hôn',
      date: '2025-01-11',
      time: '18:00',
      timeDisplay: '18:00 PM',
      location: 'Trung tâm Tiệc cưới ABC',
      address: '789 Đường GHI, Quận RST, TP. Hồ Chí Minh',
      description: 'Lễ cưới chính thức',
    },
  ],

  // Photo Album
  album: [
    '/images/album-1.webp',
    '/images/album-2.webp',
    '/images/album-3.webp',
    '/images/album-4.webp',
    '/images/album-5.webp',
    '/images/album-6.webp',
    '/images/album-7.webp',
    '/images/album-8.webp',
  ],

  // Hero Slideshow Images
  heroSlides: [
    '/images/hero-1.webp',
    '/images/hero-2.webp',
    '/images/hero-3.webp',
    '/images/hero-4.webp',
    '/images/hero-5.webp',
  ],

  // Suggested Wishes
  suggestedWishes: [
    'Chúc hai bạn trăm năm hạnh phúc!',
    'Chúc anh chị sớm có em bé!',
    'Hạnh phúc mãi mãi nhé!',
    'Chúc mừng hạnh phúc!',
    'Trăm năm hạnh phúc, sớm có thiên thần nhỏ!',
    'Chúc hai bạn luôn yêu thương nhau!',
  ],
};

export type WeddingData = typeof weddingData;
