// Wedding Data - Easy to customize
const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const weddingData = {
  // Couple Information
  groom: {
    fullName: 'Nguyễn Danh Thịnh',
    shortName: 'Danh Thịnh',
    initial: 'T',
    description: 'Là một chàng trai ấm áp, luôn yêu thương và coi trọng gia đình. Với Thịnh, gia đình không chỉ là điểm tựa mà còn là nơi gửi gắm mọi tình cảm chân thành nhất. Người luôn mang lại cảm giác an toàn và ấm cúng cho những ai ở bên.',
    image: publicAsset('/images/couple/groom-portrait.webp'),
    // ⚠️ CHƯA ĐIỀN — mục "Hộp Mừng Cưới" bị ẩn cho tới khi có bankName + number.
    //   number:   '1234567890'
    //   bankName: 'Vietcombank'
    //   qrCode:   publicAsset('/images/qr/groom-qr.webp')   ← BẮT BUỘC bọc publicAsset,
    //             để chuỗi thô '/images/...' không bị hỏng khi deploy dưới subpath.
    //             Để trống cũng được: khi đó hiện ô gợi ý dùng số tài khoản bên dưới.
    bank: {
      name: 'NGUYEN DANH THINH',
      number: '',
      bankName: '',
      qrCode: '',
    },
  },
  bride: {
    fullName: 'Phạm Thị Thuý Hằng',
    shortName: 'Thuý Hằng',
    initial: 'H',
    description: 'Là người thông minh, luôn vui vẻ và hay cười, mang đến không khí tươi sáng cho những người xung quanh. Cô ấy đôi khi tỏ ra bướng nhưng lại rất quan tâm và chăm sóc những người mình yêu thương, luôn biết cách thể hiện sự quan tâm một cách sâu sắc.',
    image: publicAsset('/images/couple/bride-portrait.webp'),
    // ⚠️ CHƯA ĐIỀN — xem ghi chú ở phần `groom` phía trên.
    bank: {
      name: 'PHAM THI THUY HANG',
      number: '',
      bankName: '',
      qrCode: '',
    },
  },

  // Monogram
  monogram: 'T & H',

  // Wedding Date
  weddingDate: new Date('2027-01-11T11:00:00+07:00'),
  weddingDateDisplay: '11 tháng 01 năm 2027',

  // Family Info
  groomFamily: {
    coPhu: '',
    ba: '',
    me: '',
  },
  brideFamily: {
    coPhu: '',
    ba: '',
    me: '',
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
      image: publicAsset('/images/story/moment-01.webp'),
      label: 'BẮT ĐẦU TỪ',
    },
    {
      id: 2,
      date: '15/06/2018',
      title: 'Hai đứa chính thức tìm hiểu nhau...',
      content: 'Lúc đó, mọi thứ thật sự rất nhẹ nhàng và trong sáng. Cả hai chỉ là những người bạn vô tình gặp gỡ, rồi dần dần có những cuộc trò chuyện kéo dài không dứt, những nụ cười cứ thế nở trên môi mỗi lần nhìn thấy nhau.',
      image: publicAsset('/images/story/moment-02.webp'),
    },
    {
      id: 3,
      date: '11/01/2027',
      title: 'Ngày chung đôi',
      content: 'Gần 10 năm bên nhau, chúng ta đã cùng nhau vượt qua bao thử thách, chia sẻ những niềm vui, nỗi buồn, và những khoảnh khắc không thể quên. Tình yêu của chúng ta đã trưởng thành, vững vàng như một cây cổ thụ, ngày càng mạnh mẽ và bền chặt hơn qua từng ngày.',
      image: publicAsset('/images/story/moment-03.webp'),
      label: 'và sau nữa',
    },
  ],

  // Wedding Events
  events: [
    {
      id: 1,
      name: 'Tiệc nhà trai',
      date: '2027-01-11',
      time: '11:00',
      timeDisplay: '11:00',
      location: 'Tư gia nhà trai',
      address: 'Địa chỉ sẽ cập nhật',
      description: 'Tiệc cưới tại nhà trai',
    },
    {
      id: 2,
      name: 'Tiệc nhà gái',
      date: '2027-01-10',
      time: '17:00',
      timeDisplay: '17:00',
      location: 'Tư gia nhà gái',
      address: 'Địa chỉ sẽ cập nhật',
      description: 'Tiệc cưới tại nhà gái',
    },
    {
      id: 3,
      name: 'Lễ Thành Hôn',
      date: '2027-01-11',
      time: '18:00',
      timeDisplay: '18:00',
      location: 'Địa điểm sẽ cập nhật',
      address: 'Địa chỉ sẽ cập nhật',
      description: 'Lễ cưới chính thức',
    },
  ],

  // Photo Album
  album: [
    publicAsset('/images/album/photo-01.webp'),
    publicAsset('/images/album/photo-02.webp'),
    publicAsset('/images/album/photo-03.webp'),
    publicAsset('/images/album/photo-04.webp'),
    publicAsset('/images/album/photo-05.webp'),
    publicAsset('/images/album/photo-06.webp'),
    publicAsset('/images/album/photo-07.webp'),
    publicAsset('/images/album/photo-08.webp'),
  ],

  // Hero Slideshow Images
  heroSlides: [
    publicAsset('/images/hero/slide-01.webp'),
    publicAsset('/images/hero/slide-02.webp'),
    publicAsset('/images/hero/slide-03.webp'),
    publicAsset('/images/hero/slide-04.webp'),
    publicAsset('/images/hero/slide-05.webp'),
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
