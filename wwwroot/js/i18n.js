// i18n – ET / RU / EN
const TRANSLATIONS = {
  et: {
    brand: 'VetClinic',

    // Navbar
    navAbout: 'Meist', navServices: 'Teenused', navClinics: 'Kliinikud',
    navContact: 'Kontakt', navLogin: 'Logi sisse', navRegister: 'Registreeru',
    navMyAccount: 'Minu konto', navAdmin: '⚙️ Admin',

    // Hero
    heroBadge: '🌟 Eesti usaldusväärseim veterinaariateenistus',
    heroTitleMain: 'Teie lemmiku tervis on meie ',
    heroTitleHighlight: 'prioriteet',
    heroSubtitle: 'Professionaalne veterinaarabi koera, kassi ja teiste lemmikloomade eest hoolitsemiseks. 3 kliinikus üle Eesti, kogenud spetsialistid, kaasaegne varustus.',
    heroCta1: '🗓 Broneeri aeg', heroCta2: 'Vaata teenuseid',
    heroStat1: 'Õnnelikku lemmiklooma', heroStat2: 'Kliiniku üle Eesti', heroStat3: 'Kogenud spetsialisti',

    // About
    aboutLabel: 'Meist',
    aboutTitle: 'Teie lemmiku usaldusväärne tervisepartner',
    aboutText1: 'VetClinic on asutatud 2014. aastal eesmärgiga pakkuda Eesti lemmikloomaomanikele kõrgeima taseme veterinaarabi. Meie spetsialistid hoiavad end pidevalt kursis viimaste teadussaavutustega.',
    aboutText2: 'Usume, et iga lemmikloom väärib parimat hoolitsust. Meie kliinikus on teie loom alati heades kätes – alates tavapärasest kontrollist kuni keeruka kirurgilise sekkumiseni.',
    aboutFeature1: 'Kogenud ja sertifitseeritud veterinaararstid',
    aboutFeature2: 'Kaasaegne diagnostikaseadmed',
    aboutFeature3: 'Laia valikuga ravimite apteek',
    aboutFeature4: 'Individuaalne lähenemine igale loomale',
    aboutStat1: 'aastat kogemust', aboutStat2: 'rahul klientidest', aboutStat3: 'hädaabi',
    aboutBtn1: 'Vaata teenuseid', aboutBtn2: 'Võta ühendust',

    // Services
    servicesLabel: 'Meie teenused',
    servicesTitle: 'Kõik, mida teie lemmik vajab',
    servicesSubtitle: 'Pakume laia valikut veterinaarteenuseid alates ennetavast tervisekontrollist kuni keerukate protseduurideni.',

    // Why
    whyLabel: 'Miks meid valida', whyTitle: 'Erinevus, mida tunned',
    why1Title: 'Asjatundlikud spetsialistid',
    why1Text: 'Kõik meie veterinaararstid omavad kõrgharidust ja regulaarset täiendkoolitust. Teie loom on professionaalide kätes.',
    why2Title: 'Kiire ja mugav broneerimine',
    why2Text: 'Broneerige aeg online ööpäev ringi. Saate kohe kinnituskirja e-postile kõigi broneeringu üksikasjadega.',
    why3Title: 'Tunnustatud kvaliteet',
    why3Text: 'Oleme pälvinud mitmeid auhindu veterinaarmeditsiini valdkonnas. 98% klientidest soovitab meid oma sõpradele.',

    // Clinics
    clinicsLabel: 'Meie kliinikud', clinicsTitle: 'Leidke lähim kliinik',
    clinicsSubtitle: 'Kolm kaasaegset kliinikut Tallinnas ja Tartus – teid on alati lähedal professionaalne abi.',

    // CTA
    ctaTitle: 'Valmis broneerima? 🐾',
    ctaSubtitle: 'Registreerige oma lemmikloom ja broneerige aeg online – kiirelt, mugavalt, usaldusväärselt.',
    ctaBtn1: 'Registreeru tasuta', ctaBtn2: 'Logi sisse',

    // Footer
    footerTagline: 'Professionaalne veterinaariateenistus Eestis. Teie lemmiku tervis ja heaolu on meie südameasi.',
    footerLinks: 'Kiirviited', footerServices: 'Teenused', footerContact: 'Kontakt',
    footerPrivacy: 'Privaatsuspoliitika', footerTerms: 'Kasutustingimused',
    footerCopy: '© 2024 VetClinic. Kõik õigused kaitstud.',
    footerHealthCheck: 'Tervisekontroll', footerVaccination: 'Vaktsineerimine',
    footerSurgery: 'Kirurgia', footerDiagnostics: 'Diagnostika',
    footerRegister: 'Registreeru',

    // Auth
    authLeftTitle: 'Teie lemmiku tervis algab siit',
    authLeftText: 'Liituge tuhandete lemmikloomaomanikega, kes usaldavad VetClinic\'i.',
    authFeature1: 'Online broneerimine ööpäev ringi',
    authFeature2: 'Kinnituskirjad e-postile',
    authFeature3: 'Broneeringute ajalugu ja haldus',
    authFeature4: 'Kõik oma lemmikloomad ühes kohas',
    authFeature5: 'Professionaalsed veterinaararstid',
    authBack: '← Tagasi avalehele',
    tabLogin: 'Logi sisse', tabRegister: 'Registreeru',
    loginTitle: 'Tere tulemast tagasi!', loginSubtitle: 'Sisesta oma andmed, et jätkata.',
    loginEmail: 'E-mail', loginPassword: 'Parool', loginBtn: 'Logi sisse',
    loginLoading: 'Sisselogimine...',
    forgotPassword: 'Unustasid parooli?', noAccount: 'Pole kontot?', register: 'Registreeru',
    registerTitle: 'Loo konto', registerSubtitle: 'Liitu VetClinic\'iga – see on tasuta!',
    regName: 'Eesnimi ja perekonnanimi', regPhone: 'Telefoninumber',
    regEmail: 'E-mail', regPassword: 'Parool', regPassword2: 'Korda parooli',
    regTerms: 'Registreerudes nõustud meie kasutustingimustega.',
    registerBtn: 'Registreeru', hasAccount: 'On juba konto?',
    resetTitle: 'Lähtesta parool', resetSubtitle: 'Sisesta uus parool',
    newPassword: 'Uus parool', confirmPassword: 'Kinnita parool', resetBtn: 'Salvesta parool',
    forgotTitle: 'Unustasid parooli?',
    forgotSubtitle: 'Sisesta oma e-mail ja saadame sulle lähtestamislingi.',
    forgotBtn: 'Saada link', backToLogin: '← Tagasi sisselogimisele',
    forgotSent: 'Kui see e-mail on registreeritud, saadame lähtestamislingi.',

    // Dashboard sidebar
    myPets: 'Minu lemmikloomad', bookTime: 'Broneeri aeg', myBookings: 'Minu broneeringud',
    medCard: 'Meditsiinikaart',
    reviews: 'Arvustused', profile: 'Profiil', home: 'Avaleht', logout: 'Logi välja',
    petOwner: 'Lemmikloomaomanik',

    // Pets
    addPet: '+ Lisa lemmikloom', noPets: 'Sul pole veel lemmikloomi',
    noPetsText: 'Lisa oma esimene lemmikloom, et broneeringuid teha.',
    petName: 'Nimi', petSpecies: 'Liik', petWeight: 'Kaal (kg)', petAge: 'Vanus (aastad)',
    editPet: 'Muuda lemmiklooma', save: 'Salvesta', cancel: 'Tühista',
    confirmDelete: 'Kustuta lemmikloom "{name}"? See toiming on pöördumatu.',
    petAdded: 'Lemmikloom lisatud! 🐾', petUpdated: 'Lemmikloom uuendatud! ✅',
    petDeleted: 'Lemmikloom kustutatud.',

    // Booking form
    bookTitle: 'Broneeri aeg', bookSubtitle: 'Vali protseduur, kliinik ja sobiv aeg',
    selectPet: 'Vali lemmikloom...', selectProc: 'Vali protseduur...',
    selectClinic: 'Vali kliinik...', selectDate: 'Kuupäev *',
    bookNotes: 'Märkused (valikuline)', bookNotesPlaceholder: 'Lisa lisainfo arsti jaoks...',
    bookBtn: '📅 Broneeri aeg', bookEmailNote: '📧 Pärast broneerimist saadetakse kinnituskiri teie e-postile.',
    availableSlots: 'Saadaolevad ajad', bookingDone: 'Broneering tehtud! 📧 Kinnituskiri saadetud.',

    // Bookings list
    myBookingsTitle: 'Minu broneeringud',
    myBookingsSubtitle: 'Kõik teie veterinaarkliinikusse tehtud broneeringud',
    newBooking: '+ Uus broneering', noBookings: 'Broneeringud puuduvad',
    noBookingsText: 'Teil pole veel ühtegi broneeringut.',
    searchPlaceholder: '🔍 Otsi broneeringuid...', statusAll: 'Kõik staatused',
    statusPending: 'Ootel', statusApproved: 'Kinnitatud', statusRejected: 'Lükatud',
    pet: 'Lemmikloom', clinic: 'Kliinik', address: 'Aadress', date: 'Kuupäev',
    price: 'Hind', notesLabel: 'Märkused', bookingNr: 'Broneering #',
    cancelBookingBtn: 'Tühista broneering', repeatBookingBtn: '🔄 Uuesti broneeri',
    cancelConfirm: 'Tühistada broneering #{id}? Kinnituskiri saadetakse e-postile.',

    // Med card
    medCardTitle: 'Meditsiinikaart', medCardSubtitle: 'Teie lemmiku tervise ajalugu',
    selectPetMed: 'Vali lemmikloom...', noMedRecords: 'Meditsiinikaart on tühi',
    noMedRecordsText: 'Veel pole ühtegi haiguslugu lisatud.',
    diagnosis: 'Diagnoos', treatment: 'Ravi', vet: 'Arst', notes: 'Märkused',
    weight: 'Kaal', medicines: '💊 Ravimid', weightLabel: '⚖️ Kaal',
    exportPdf: '📄 Ekspordi PDF', exportExcel: '📊 Ekspordi Excel',

    // Weight chart
    weightChartTitle: 'Kaalu dünaamika',

    

    // Reviews
    reviewsTitle: 'Arvustused', reviewsSubtitle: 'Klientide tagasiside meie kliinikute kohta',
    addReview: 'Lisa arvustus', rating: 'Hinnang', comment: 'Kommentaar',
    submitReview: 'Saada', allClinics: 'Kõik kliinikud',
    noReviews: 'Arvustused puuduvad',
    reviewDuplicate: 'Olete juba selle kliiniku arvustuse kirjutanud.',

    // Profile
    profileTitle: 'Minu profiil', profileSubtitle: 'Teie konto andmed', userRole: 'Kasutaja',

    // Errors
    fillRequired: '❌ Täida kõik kohustuslikud väljad.',
    timeConflict: 'See aeg on juba broneeritud. Palun valige teine aeg.',
    loadError: 'Laadimine ebaõnnestus.',

    // Export
    exportBookings: '📊 Ekspordi broneeringud',
    exportMedCard: '📄 Ekspordi medkaart',

    // Lang labels (no flag emojis — Windows renders them as letter pairs)
    langEt: 'ET — Eesti', langRu: 'RU — Русский', langEn: 'EN — English',

    // Service card
    serviceFrom: 'alates', serviceMin: 'min',

    // Reset token expired
    resetTokenExpired: 'Link on aegunud või vale. Palun taotlege uus.',

    // Admin sidebar
    adminOverview: 'Ülevaade', adminManagement: 'Haldus', adminLinks: 'Lingid',
    adminDashboard: 'Ülevaade', adminBookings: 'Broneeringud', adminClinics: 'Kliinikud',
    adminProcedures: 'Protseduurid', adminUsers: 'Kasutajad', adminCharts: 'Graafikud',
    adminCalendar: 'Kalender', adminMedRecords: 'Meditsiinikaardid',
    adminHome: 'Avaleht', adminLogout: 'Logi välja',

    // Admin dashboard
    adminWelcome: 'Tere tulemast, admin! 👋', adminWelcomeSub: 'Siin on VetClinic\'i ülevaade',
    adminRecentBookings: 'Viimased broneeringud', adminViewAll: 'Vaata kõiki',
    adminPendingTitle: 'Ootel broneeringud',
    statTotal: 'Kokku broneeringuid', statPending: 'Ootel kinnitust',
    statConfirmed: 'Kinnitatud', statRejected: 'Lükatud tagasi',
    statUsers: 'Kasutajat', statPets: 'Lemmiklooma',

    // Admin sections
    adminAllBookings: 'Kõik broneeringud', adminAllBookingsSub: 'Halda klientide broneeringuid',
    adminUpdate: '🔄 Uuenda',
    adminSearchBooking: '🔍 Otsi kliendi, lemmiklooma, kliiniku järgi...',
    adminClinicsTitle: 'Kliinikud', adminClinicsSub: 'Halda veterinaarkliiniku asukohti',
    adminAddClinic: '+ Lisa kliinik',
    adminProceduresTitle: 'Protseduurid', adminProceduresSub: 'Halda pakutavaid veterinaariateenuseid',
    adminAddProc: '+ Lisa protseduur',
    adminUsersTitle: 'Kasutajad', adminUsersSub: 'Kõik registreeritud kasutajad',
    adminChartsTitle: '📈 Graafikud', adminChartsSub: 'Broneeringute ja teenuste statistika',
    adminCalendarTitle: '🗓 Broneeringute kalender', adminCalendarSub: 'Vaata broneeringuid kalendris',
    adminMedTitle: '🩺 Meditsiinikaardid', adminMedSub: 'Lisa ja halda lemmikloomade meditsiinilisi andmeid',
    adminAddMed: '+ Lisa kirje',

    // Charts
    chartByStatus: 'Broneeringud staatuste järgi', chartByProcedure: 'Broneeringud protseduuride järgi',
    chartByClinic: 'Broneeringud kliinikute järgi', chartWeekly: 'Broneeringud viimase 7 päeva jooksul',

    // Table headers
    colClient: 'Klient', colPet: 'Lemmikloom', colProcedure: 'Protseduur',
    colClinic: 'Kliinik', colDate: 'Kuupäev', colPrice: 'Hind',
    colStatus: 'Staatus', colActions: 'Toimingud', colName: 'Nimi',
    colPhone: 'Telefon', colRole: 'Roll', colPets: 'Lemmikloomad',
    colBookingCount: 'Broneeringud', colJoined: 'Liitunud',
    colIcon: 'Ikoon', colCategory: 'Kategooria', colDuration: 'Kestus', colDesc: 'Kirjeldus',

    // Status modal
    adminChangeStatus: 'Muuda broneeringu staatust', adminNewStatus: 'Uus staatus',
    adminNewClinic: 'Uus kliinik', adminSelectClinic: 'Vali kliinik...',
    adminTransferNote: '🔄 Broneering kantakse üle valitud kliinikusse.',
    adminSave: 'Salvesta', adminCancel: 'Tühista',

    // Clinic/Procedure/Med modals
    adminClinicName: 'Kliiniku nimi *', adminClinicAddress: 'Aadress *',
    adminProcName: 'Protseduuri nimi *', adminProcIcon: 'Ikoon (emoji)',
    adminProcCategory: 'Kategooria *', adminProcPrice: 'Hind (€) *', adminProcDuration: 'Kestus (minutites) *',
    procNameRu: 'Nimi (RU)', procNameEn: 'Nimi (EN)', procDescRu: 'Kirjeldus (RU)', procDescEn: 'Kirjeldus (EN)',
    adminMedPet: 'Lemmikloom *', adminMedDate: 'Kuupäev *',
    adminMedDiagnosis: 'Diagnoos *', adminMedTreatment: 'Ravi *',
    adminMedVet: 'Arsti nimi', adminMedWeight: 'Kaal (kg)', adminMedMeds: 'Ravimid',
    adminAddClinicBtn: 'Lisa kliinik', adminAddProcBtn: 'Lisa protseduur', adminEditProcBtn: 'Salvesta muutused',
    adminEditProc: 'Muuda protseduuri', adminEditClinic: 'Muuda kliinikut',
    adminAddMedTitle: 'Lisa meditsiinikirje', adminSelectPet: 'Vali lemmikloom...',

    // Sidebar section labels
    sidebarMenu: 'Menüü', sidebarAccount: 'Konto',

    // Pets section subtitle
    petsSubtitle: 'Halda oma lemmikloomade andmeid',

    // Booking form labels
    procLabel: 'Protseduur *', clinicLabel: 'Kliinik *',

    // Review placeholder
    reviewPlaceholder: 'Teie arvamus...',

    // Transfer status
    statusTransferred: '🔄 Kanna üle',

    // Pet species
    speciesDog: '🐕 Koer', speciesCat: '🐈 Kass', speciesRabbit: '🐇 Küülik',
    speciesBird: '🦜 Lind', speciesOther: '🐾 Muu',

    // Procedure categories
    catPrevention: 'Ennetus', catDiagnostics: 'Diagnostika', catSurgery: 'Kirurgia',
    catDental: 'Hambaravi', catGrooming: 'Grooming', catChip: 'Identifitseerimine', catOther: 'Muu',
  },

  ru: {
    brand: 'VetClinic',

    // Navbar
    navAbout: 'О нас', navServices: 'Услуги', navClinics: 'Клиники',
    navContact: 'Контакты', navLogin: 'Войти', navRegister: 'Регистрация',
    navMyAccount: 'Мой кабинет', navAdmin: '⚙️ Админ',

    // Hero
    heroBadge: '🌟 Самая надёжная ветклиника Эстонии',
    heroTitleMain: 'Здоровье вашего питомца — наш ',
    heroTitleHighlight: 'приоритет',
    heroSubtitle: 'Профессиональная ветеринарная помощь для собак, кошек и других животных. 3 клиники по всей Эстонии, опытные специалисты, современное оборудование.',
    heroCta1: '🗓 Записаться', heroCta2: 'Посмотреть услуги',
    heroStat1: 'Счастливых питомцев', heroStat2: 'Клиники по Эстонии', heroStat3: 'Опытных специалистов',

    // About
    aboutLabel: 'О нас',
    aboutTitle: 'Надёжный партнёр для здоровья вашего питомца',
    aboutText1: 'VetClinic основана в 2014 году с целью предоставления ветеринарной помощи высшего класса. Наши специалисты постоянно следят за последними научными достижениями.',
    aboutText2: 'Мы верим, что каждый питомец заслуживает наилучшего ухода. В нашей клинике ваш питомец всегда в надёжных руках — от обычного осмотра до сложного хирургического вмешательства.',
    aboutFeature1: 'Опытные сертифицированные ветеринары',
    aboutFeature2: 'Современное диагностическое оборудование',
    aboutFeature3: 'Широкий ассортимент ветеринарных препаратов',
    aboutFeature4: 'Индивидуальный подход к каждому животному',
    aboutStat1: 'лет опыта', aboutStat2: 'довольных клиентов', aboutStat3: 'скорая помощь',
    aboutBtn1: 'Посмотреть услуги', aboutBtn2: 'Связаться с нами',

    // Services
    servicesLabel: 'Наши услуги',
    servicesTitle: 'Всё, что нужно вашему питомцу',
    servicesSubtitle: 'Широкий спектр ветеринарных услуг от профилактических осмотров до сложных процедур.',

    // Why
    whyLabel: 'Почему мы', whyTitle: 'Разница, которую вы почувствуете',
    why1Title: 'Квалифицированные специалисты',
    why1Text: 'Все наши ветеринары имеют высшее образование и регулярно проходят повышение квалификации. Ваш питомец в руках профессионалов.',
    why2Title: 'Быстрая и удобная запись',
    why2Text: 'Записывайтесь онлайн круглосуточно. Получите подтверждение на почту сразу со всеми деталями записи.',
    why3Title: 'Признанное качество',
    why3Text: 'Мы удостоены множества наград в области ветеринарии. 98% клиентов рекомендуют нас своим друзьям.',

    // Clinics
    clinicsLabel: 'Наши клиники', clinicsTitle: 'Найдите ближайшую клинику',
    clinicsSubtitle: 'Три современные клиники в Таллинне и Тарту — профессиональная помощь всегда рядом.',

    // CTA
    ctaTitle: 'Готовы записаться? 🐾',
    ctaSubtitle: 'Зарегистрируйте питомца и запишитесь онлайн — быстро, удобно, надёжно.',
    ctaBtn1: 'Зарегистрироваться бесплатно', ctaBtn2: 'Войти',

    // Footer
    footerTagline: 'Профессиональная ветеринарная помощь в Эстонии. Здоровье и благополучие вашего питомца — наше призвание.',
    footerLinks: 'Быстрые ссылки', footerServices: 'Услуги', footerContact: 'Контакты',
    footerPrivacy: 'Политика конфиденциальности', footerTerms: 'Условия использования',
    footerCopy: '© 2024 VetClinic. Все права защищены.',
    footerHealthCheck: 'Осмотр', footerVaccination: 'Вакцинация',
    footerSurgery: 'Хирургия', footerDiagnostics: 'Диагностика',
    footerRegister: 'Регистрация',

    // Auth
    authLeftTitle: 'Здоровье вашего питомца начинается здесь',
    authLeftText: 'Присоединяйтесь к тысячам владельцев, которые доверяют VetClinic.',
    authFeature1: 'Онлайн-запись круглосуточно',
    authFeature2: 'Подтверждения на электронную почту',
    authFeature3: 'История и управление записями',
    authFeature4: 'Все питомцы в одном месте',
    authFeature5: 'Профессиональные ветеринары',
    authBack: '← Вернуться на главную',
    tabLogin: 'Войти', tabRegister: 'Регистрация',
    loginTitle: 'С возвращением!', loginSubtitle: 'Введите данные, чтобы продолжить.',
    loginEmail: 'E-mail', loginPassword: 'Пароль', loginBtn: 'Войти',
    loginLoading: 'Вход...',
    forgotPassword: 'Забыли пароль?', noAccount: 'Нет аккаунта?', register: 'Зарегистрироваться',
    registerTitle: 'Создать аккаунт', registerSubtitle: 'Присоединяйтесь к VetClinic — это бесплатно!',
    regName: 'Имя и фамилия', regPhone: 'Номер телефона',
    regEmail: 'E-mail', regPassword: 'Пароль', regPassword2: 'Повторите пароль',
    regTerms: 'Регистрируясь, вы соглашаетесь с условиями использования.',
    registerBtn: 'Зарегистрироваться', hasAccount: 'Уже есть аккаунт?',
    resetTitle: 'Сброс пароля', resetSubtitle: 'Введите новый пароль',
    newPassword: 'Новый пароль', confirmPassword: 'Подтвердите пароль', resetBtn: 'Сохранить пароль',
    forgotTitle: 'Забыли пароль?',
    forgotSubtitle: 'Введите email и мы отправим ссылку для сброса.',
    forgotBtn: 'Отправить ссылку', backToLogin: '← Вернуться ко входу',
    forgotSent: 'Если этот email зарегистрирован, мы отправим ссылку для сброса.',

    // Dashboard sidebar
    myPets: 'Мои питомцы', bookTime: 'Записаться', myBookings: 'Мои записи',
    medCard: 'Медкарта', 
    reviews: 'Отзывы', profile: 'Профиль', home: 'Главная', logout: 'Выйти',
    petOwner: 'Владелец питомцев',

    // Pets
    addPet: '+ Добавить питомца', noPets: 'У вас пока нет питомцев',
    noPetsText: 'Добавьте первого питомца, чтобы сделать запись.',
    petName: 'Имя', petSpecies: 'Вид', petWeight: 'Вес (кг)', petAge: 'Возраст (лет)',
    editPet: 'Редактировать питомца', save: 'Сохранить', cancel: 'Отмена',
    confirmDelete: 'Удалить питомца "{name}"? Это действие необратимо.',
    petAdded: 'Питомец добавлен! 🐾', petUpdated: 'Питомец обновлён! ✅',
    petDeleted: 'Питомец удалён.',

    // Booking form
    bookTitle: 'Записаться', bookSubtitle: 'Выберите процедуру, клинику и удобное время',
    selectPet: 'Выберите питомца...', selectProc: 'Выберите процедуру...',
    selectClinic: 'Выберите клинику...', selectDate: 'Дата *',
    bookNotes: 'Примечания (необязательно)', bookNotesPlaceholder: 'Дополнительная информация для врача...',
    bookBtn: '📅 Записаться', bookEmailNote: '📧 После записи вы получите подтверждение на почту.',
    availableSlots: 'Доступное время', bookingDone: 'Запись создана! 📧 Подтверждение отправлено.',

    // Bookings list
    myBookingsTitle: 'Мои записи',
    myBookingsSubtitle: 'Все ваши записи в ветеринарную клинику',
    newBooking: '+ Новая запись', noBookings: 'Записей нет',
    noBookingsText: 'У вас пока нет ни одной записи.',
    searchPlaceholder: '🔍 Поиск записей...', statusAll: 'Все статусы',
    statusPending: 'Ожидание', statusApproved: 'Подтверждено', statusRejected: 'Отклонено',
    pet: 'Питомец', clinic: 'Клиника', address: 'Адрес', date: 'Дата',
    price: 'Стоимость', notesLabel: 'Примечания', bookingNr: 'Запись #',
    cancelBookingBtn: 'Отменить запись', repeatBookingBtn: '🔄 Записаться снова',
    cancelConfirm: 'Отменить запись #{id}? Уведомление будет отправлено на почту.',

    // Med card
    medCardTitle: 'Медицинская карта', medCardSubtitle: 'История здоровья вашего питомца',
    selectPetMed: 'Выберите питомца...', noMedRecords: 'Медкарта пуста',
    noMedRecordsText: 'Записи о визитах ещё не добавлены.',
    diagnosis: 'Диагноз', treatment: 'Лечение', vet: 'Врач', notes: 'Примечания',
    weight: 'Вес', medicines: '💊 Лекарства', weightLabel: '⚖️ Вес',
    exportPdf: '📄 Экспорт PDF', exportExcel: '📊 Экспорт Excel',

    // Weight chart
    weightChartTitle: 'Динамика веса',

    

    // Reviews
    reviewsTitle: 'Отзывы', reviewsSubtitle: 'Отзывы клиентов о наших клиниках',
    addReview: 'Написать отзыв', rating: 'Оценка', comment: 'Комментарий',
    submitReview: 'Отправить', allClinics: 'Все клиники',
    noReviews: 'Отзывов пока нет',
    reviewDuplicate: 'Вы уже оставили отзыв для этой клиники.',

    // Profile
    profileTitle: 'Мой профиль', profileSubtitle: 'Данные вашего аккаунта', userRole: 'Пользователь',

    // Errors
    fillRequired: '❌ Заполните все обязательные поля.',
    timeConflict: 'Это время уже занято. Пожалуйста, выберите другое.',
    loadError: 'Ошибка загрузки.',

    // Export
    exportBookings: '📊 Экспорт записей',
    exportMedCard: '📄 Экспорт медкарты',

    // Lang labels
    langEt: 'ET — Eesti', langRu: 'RU — Русский', langEn: 'EN — English',

    // Service card
    serviceFrom: 'от', serviceMin: 'мин',

    // Reset token expired
    resetTokenExpired: 'Ссылка устарела или недействительна. Запросите новую.',

    // Admin sidebar
    adminOverview: 'Обзор', adminManagement: 'Управление', adminLinks: 'Ссылки',
    adminDashboard: 'Обзор', adminBookings: 'Записи', adminClinics: 'Клиники',
    adminProcedures: 'Процедуры', adminUsers: 'Пользователи', adminCharts: 'Графики',
    adminCalendar: 'Календарь', adminMedRecords: 'Медкарты',
    adminHome: 'Главная', adminLogout: 'Выйти',

    adminWelcome: 'Добро пожаловать, admin! 👋', adminWelcomeSub: 'Обзор VetClinic',
    adminRecentBookings: 'Последние записи', adminViewAll: 'Посмотреть все',
    adminPendingTitle: 'Ожидающие записи',
    statTotal: 'Всего бронирований', statPending: 'Ожидают подтверждения',
    statConfirmed: 'Подтверждено', statRejected: 'Отклонено',
    statUsers: 'Пользователей', statPets: 'Питомцев',

    adminAllBookings: 'Все записи', adminAllBookingsSub: 'Управление записями клиентов',
    adminUpdate: '🔄 Обновить',
    adminSearchBooking: '🔍 Поиск по клиенту, питомцу, клинике...',
    adminClinicsTitle: 'Клиники', adminClinicsSub: 'Управление клиниками',
    adminAddClinic: '+ Добавить клинику',
    adminProceduresTitle: 'Процедуры', adminProceduresSub: 'Управление ветеринарными услугами',
    adminAddProc: '+ Добавить процедуру',
    adminUsersTitle: 'Пользователи', adminUsersSub: 'Все зарегистрированные пользователи',
    adminChartsTitle: '📈 Графики', adminChartsSub: 'Статистика записей и услуг',
    adminCalendarTitle: '🗓 Календарь записей', adminCalendarSub: 'Просмотр записей в календаре',
    adminMedTitle: '🩺 Медкарты', adminMedSub: 'Добавление и управление медицинскими данными питомцев',
    adminAddMed: '+ Добавить запись',

    chartByStatus: 'Записи по статусам', chartByProcedure: 'Записи по процедурам',
    chartByClinic: 'Записи по клиникам', chartWeekly: 'Записи за последние 7 дней',

    colClient: 'Клиент', colPet: 'Питомец', colProcedure: 'Процедура',
    colClinic: 'Клиника', colDate: 'Дата', colPrice: 'Цена',
    colStatus: 'Статус', colActions: 'Действия', colName: 'Имя',
    colPhone: 'Телефон', colRole: 'Роль', colPets: 'Питомцы',
    colBookingCount: 'Записи', colJoined: 'Зарегистрирован',
    colIcon: 'Иконка', colCategory: 'Категория', colDuration: 'Длительность', colDesc: 'Описание',

    adminChangeStatus: 'Изменить статус записи', adminNewStatus: 'Новый статус',
    adminNewClinic: 'Новая клиника', adminSelectClinic: 'Выберите клинику...',
    adminTransferNote: '🔄 Запись будет перенесена в выбранную клинику.',
    adminSave: 'Сохранить', adminCancel: 'Отмена',

    adminClinicName: 'Название клиники *', adminClinicAddress: 'Адрес *',
    adminProcName: 'Название процедуры *', adminProcIcon: 'Иконка (emoji)',
    adminProcCategory: 'Категория *', adminProcPrice: 'Цена (€) *', adminProcDuration: 'Длительность (минуты) *',
    procNameRu: 'Название (RU)', procNameEn: 'Название (EN)', procDescRu: 'Описание (RU)', procDescEn: 'Описание (EN)',
    adminMedPet: 'Питомец *', adminMedDate: 'Дата *',
    adminMedDiagnosis: 'Диагноз *', adminMedTreatment: 'Лечение *',
    adminMedVet: 'Имя врача', adminMedWeight: 'Вес (кг)', adminMedMeds: 'Лекарства',
    adminAddClinicBtn: 'Добавить клинику', adminAddProcBtn: 'Добавить процедуру', adminEditProcBtn: 'Сохранить изменения',
    adminEditProc: 'Редактировать процедуру', adminEditClinic: 'Редактировать клинику',
    adminAddMedTitle: 'Добавить медзапись', adminSelectPet: 'Выберите питомца...',

    // Sidebar section labels
    sidebarMenu: 'Меню', sidebarAccount: 'Аккаунт',

    // Pets section subtitle
    petsSubtitle: 'Управление данными питомцев',

    // Booking form labels
    procLabel: 'Процедура *', clinicLabel: 'Клиника *',

    // Review placeholder
    reviewPlaceholder: 'Ваш отзыв...',

    // Transfer status
    statusTransferred: '🔄 Перенести',

    // Pet species
    speciesDog: '🐕 Собака', speciesCat: '🐈 Кошка', speciesRabbit: '🐇 Кролик',
    speciesBird: '🦜 Птица', speciesOther: '🐾 Другой',

    // Procedure categories
    catPrevention: 'Профилактика', catDiagnostics: 'Диагностика', catSurgery: 'Хирургия',
    catDental: 'Стоматология', catGrooming: 'Груминг', catChip: 'Идентификация', catOther: 'Другое',
  },

  en: {
    brand: 'VetClinic',

    // Navbar
    navAbout: 'About', navServices: 'Services', navClinics: 'Clinics',
    navContact: 'Contact', navLogin: 'Log in', navRegister: 'Register',
    navMyAccount: 'My account', navAdmin: '⚙️ Admin',

    // Hero
    heroBadge: '🌟 Estonia\'s most trusted vet service',
    heroTitleMain: 'Your pet\'s health is our ',
    heroTitleHighlight: 'priority',
    heroSubtitle: 'Professional veterinary care for dogs, cats and other animals. 3 clinics across Estonia, experienced specialists, modern equipment.',
    heroCta1: '🗓 Book appointment', heroCta2: 'View services',
    heroStat1: 'Happy pets', heroStat2: 'Clinics in Estonia', heroStat3: 'Experienced vets',

    // About
    aboutLabel: 'About',
    aboutTitle: 'Your pet\'s trusted health partner',
    aboutText1: 'VetClinic was founded in 2014 to provide the highest level of veterinary care in Estonia. Our specialists stay up to date with the latest scientific advances.',
    aboutText2: 'We believe every pet deserves the best care. At our clinic your animal is always in good hands — from a routine check-up to complex surgical intervention.',
    aboutFeature1: 'Experienced certified veterinarians',
    aboutFeature2: 'Modern diagnostic equipment',
    aboutFeature3: 'Wide range of veterinary medicines',
    aboutFeature4: 'Individual approach to every animal',
    aboutStat1: 'years experience', aboutStat2: 'satisfied clients', aboutStat3: 'emergency care',
    aboutBtn1: 'View services', aboutBtn2: 'Contact us',

    // Services
    servicesLabel: 'Our services',
    servicesTitle: 'Everything your pet needs',
    servicesSubtitle: 'A wide range of veterinary services from preventive check-ups to complex procedures.',

    // Why
    whyLabel: 'Why choose us', whyTitle: 'The difference you\'ll feel',
    why1Title: 'Expert specialists',
    why1Text: 'All our vets hold higher education degrees and undergo regular training. Your pet is in the hands of professionals.',
    why2Title: 'Fast & easy booking',
    why2Text: 'Book online 24/7. Get an instant confirmation email with all your appointment details.',
    why3Title: 'Recognised quality',
    why3Text: 'We\'ve received numerous awards in the field of veterinary medicine. 98% of clients recommend us to their friends.',

    // Clinics
    clinicsLabel: 'Our clinics', clinicsTitle: 'Find your nearest clinic',
    clinicsSubtitle: 'Three modern clinics in Tallinn and Tartu — professional help always nearby.',

    // CTA
    ctaTitle: 'Ready to book? 🐾',
    ctaSubtitle: 'Register your pet and book online – fast, convenient, reliable.',
    ctaBtn1: 'Register for free', ctaBtn2: 'Log in',

    // Footer
    footerTagline: 'Professional veterinary service in Estonia. Your pet\'s health and well-being is our mission.',
    footerLinks: 'Quick links', footerServices: 'Services', footerContact: 'Contact',
    footerPrivacy: 'Privacy policy', footerTerms: 'Terms of use',
    footerCopy: '© 2024 VetClinic. All rights reserved.',
    footerHealthCheck: 'Health check', footerVaccination: 'Vaccination',
    footerSurgery: 'Surgery', footerDiagnostics: 'Diagnostics',
    footerRegister: 'Register',

    // Auth
    authLeftTitle: 'Your pet\'s health starts here',
    authLeftText: 'Join thousands of pet owners who trust VetClinic.',
    authFeature1: 'Online booking around the clock',
    authFeature2: 'Confirmation emails',
    authFeature3: 'Booking history and management',
    authFeature4: 'All your pets in one place',
    authFeature5: 'Professional veterinarians',
    authBack: '← Back to home',
    tabLogin: 'Log in', tabRegister: 'Register',
    loginTitle: 'Welcome back!', loginSubtitle: 'Enter your details to continue.',
    loginEmail: 'E-mail', loginPassword: 'Password', loginBtn: 'Log in',
    loginLoading: 'Logging in...',
    forgotPassword: 'Forgot password?', noAccount: 'No account?', register: 'Register',
    registerTitle: 'Create account', registerSubtitle: 'Join VetClinic – it\'s free!',
    regName: 'Full name', regPhone: 'Phone number',
    regEmail: 'E-mail', regPassword: 'Password', regPassword2: 'Confirm password',
    regTerms: 'By registering you agree to our terms of use.',
    registerBtn: 'Register', hasAccount: 'Already have an account?',
    resetTitle: 'Reset password', resetSubtitle: 'Enter your new password',
    newPassword: 'New password', confirmPassword: 'Confirm password', resetBtn: 'Save password',
    forgotTitle: 'Forgot password?',
    forgotSubtitle: 'Enter your email and we\'ll send you a reset link.',
    forgotBtn: 'Send link', backToLogin: '← Back to login',
    forgotSent: 'If this email is registered, we\'ll send a reset link.',

    // Dashboard sidebar
    myPets: 'My pets', bookTime: 'Book appointment', myBookings: 'My bookings',
    medCard: 'Medical record', 
    reviews: 'Reviews', profile: 'Profile', home: 'Home', logout: 'Log out',
    petOwner: 'Pet owner',

    // Pets
    addPet: '+ Add pet', noPets: 'You have no pets yet',
    noPetsText: 'Add your first pet to make bookings.',
    petName: 'Name', petSpecies: 'Species', petWeight: 'Weight (kg)', petAge: 'Age (years)',
    editPet: 'Edit pet', save: 'Save', cancel: 'Cancel',
    confirmDelete: 'Delete pet "{name}"? This action is irreversible.',
    petAdded: 'Pet added! 🐾', petUpdated: 'Pet updated! ✅', petDeleted: 'Pet deleted.',

    // Booking form
    bookTitle: 'Book appointment', bookSubtitle: 'Choose a procedure, clinic and time',
    selectPet: 'Select pet...', selectProc: 'Select procedure...',
    selectClinic: 'Select clinic...', selectDate: 'Date *',
    bookNotes: 'Notes (optional)', bookNotesPlaceholder: 'Additional info for the vet...',
    bookBtn: '📅 Book appointment', bookEmailNote: '📧 A confirmation email will be sent after booking.',
    availableSlots: 'Available times', bookingDone: 'Booking made! 📧 Confirmation sent.',

    // Bookings list
    myBookingsTitle: 'My bookings',
    myBookingsSubtitle: 'All your vet clinic appointments',
    newBooking: '+ New booking', noBookings: 'No bookings',
    noBookingsText: 'You have no bookings yet.',
    searchPlaceholder: '🔍 Search bookings...', statusAll: 'All statuses',
    statusPending: 'Pending', statusApproved: 'Confirmed', statusRejected: 'Cancelled',
    pet: 'Pet', clinic: 'Clinic', address: 'Address', date: 'Date',
    price: 'Price', notesLabel: 'Notes', bookingNr: 'Booking #',
    cancelBookingBtn: 'Cancel booking', repeatBookingBtn: '🔄 Book again',
    cancelConfirm: 'Cancel booking #{id}? A notification will be sent to your email.',

    // Med card
    medCardTitle: 'Medical records', medCardSubtitle: 'Your pet\'s health history',
    selectPetMed: 'Select pet...', noMedRecords: 'Medical card is empty',
    noMedRecordsText: 'No visit records have been added yet.',
    diagnosis: 'Diagnosis', treatment: 'Treatment', vet: 'Vet', notes: 'Notes',
    weight: 'Weight', medicines: '💊 Medicines', weightLabel: '⚖️ Weight',
    exportPdf: '📄 Export PDF', exportExcel: '📊 Export Excel',

    // Weight chart
    weightChartTitle: 'Weight dynamics',

   

    // Reviews
    reviewsTitle: 'Reviews', reviewsSubtitle: 'Client feedback on our clinics',
    addReview: 'Write a review', rating: 'Rating', comment: 'Comment',
    submitReview: 'Submit', allClinics: 'All clinics',
    noReviews: 'No reviews yet',
    reviewDuplicate: 'You have already reviewed this clinic.',

    // Profile
    profileTitle: 'My profile', profileSubtitle: 'Your account details', userRole: 'User',

    // Errors
    fillRequired: '❌ Please fill in all required fields.',
    timeConflict: 'This time slot is already taken. Please choose another.',
    loadError: 'Loading failed.',

    // Export
    exportBookings: '📊 Export bookings',
    exportMedCard: '📄 Export medical card',

    // Lang labels
    langEt: 'ET — Eesti', langRu: 'RU — Русский', langEn: 'EN — English',

    // Service card
    serviceFrom: 'from', serviceMin: 'min',

    // Reset token expired
    resetTokenExpired: 'Link has expired or is invalid. Please request a new one.',

    // Admin sidebar
    adminOverview: 'Overview', adminManagement: 'Management', adminLinks: 'Links',
    adminDashboard: 'Overview', adminBookings: 'Bookings', adminClinics: 'Clinics',
    adminProcedures: 'Procedures', adminUsers: 'Users', adminCharts: 'Charts',
    adminCalendar: 'Calendar', adminMedRecords: 'Medical records',
    adminHome: 'Home', adminLogout: 'Log out',
    adminWelcome: 'Welcome, admin! 👋', adminWelcomeSub: 'VetClinic overview',
    adminRecentBookings: 'Recent bookings', adminViewAll: 'View all',
    adminPendingTitle: 'Pending bookings',
    statTotal: 'Total bookings', statPending: 'Pending confirmation',
    statConfirmed: 'Confirmed', statRejected: 'Rejected',
    statUsers: 'Users', statPets: 'Pets',
    adminAllBookings: 'All bookings', adminAllBookingsSub: 'Manage client bookings',
    adminUpdate: '🔄 Refresh',
    adminSearchBooking: '🔍 Search by client, pet, clinic...',
    adminClinicsTitle: 'Clinics', adminClinicsSub: 'Manage clinic locations', adminAddClinic: '+ Add clinic',
    adminProceduresTitle: 'Procedures', adminProceduresSub: 'Manage veterinary services', adminAddProc: '+ Add procedure',
    adminUsersTitle: 'Users', adminUsersSub: 'All registered users',
    adminChartsTitle: '📈 Charts', adminChartsSub: 'Bookings and services statistics',
    adminCalendarTitle: '🗓 Bookings calendar', adminCalendarSub: 'View bookings in calendar',
    adminMedTitle: '🩺 Medical records', adminMedSub: 'Add and manage pet medical records', adminAddMed: '+ Add record',
    chartByStatus: 'Bookings by status', chartByProcedure: 'Bookings by procedure',
    chartByClinic: 'Bookings by clinic', chartWeekly: 'Bookings in the last 7 days',
    colClient: 'Client', colPet: 'Pet', colProcedure: 'Procedure', colClinic: 'Clinic',
    colDate: 'Date', colPrice: 'Price', colStatus: 'Status', colActions: 'Actions',
    colName: 'Name', colPhone: 'Phone', colRole: 'Role', colPets: 'Pets',
    colBookingCount: 'Bookings', colJoined: 'Joined',
    colIcon: 'Icon', colCategory: 'Category', colDuration: 'Duration', colDesc: 'Description',
    adminChangeStatus: 'Change booking status', adminNewStatus: 'New status',
    adminNewClinic: 'New clinic', adminSelectClinic: 'Select clinic...',
    adminTransferNote: '🔄 Booking will be transferred to the selected clinic.',
    adminSave: 'Save', adminCancel: 'Cancel',
    adminClinicName: 'Clinic name *', adminClinicAddress: 'Address *',
    adminProcName: 'Procedure name *', adminProcIcon: 'Icon (emoji)',
    adminProcCategory: 'Category *', adminProcPrice: 'Price (€) *', adminProcDuration: 'Duration (minutes) *',
    procNameRu: 'Name (RU)', procNameEn: 'Name (EN)', procDescRu: 'Description (RU)', procDescEn: 'Description (EN)',
    adminMedPet: 'Pet *', adminMedDate: 'Date *', adminMedDiagnosis: 'Diagnosis *',
    adminMedTreatment: 'Treatment *', adminMedVet: 'Vet name', adminMedWeight: 'Weight (kg)',
    adminMedMeds: 'Medicines', adminAddClinicBtn: 'Add clinic', adminAddProcBtn: 'Add procedure', adminEditProcBtn: 'Save changes',
    adminEditProc: 'Edit procedure', adminEditClinic: 'Edit clinic',
    adminAddMedTitle: 'Add medical record', adminSelectPet: 'Select pet...',

    // Sidebar section labels
    sidebarMenu: 'Menu', sidebarAccount: 'Account',

    // Pets section subtitle
    petsSubtitle: 'Manage your pet data',

    // Booking form labels
    procLabel: 'Procedure *', clinicLabel: 'Clinic *',

    // Review placeholder
    reviewPlaceholder: 'Your review...',

    // Transfer status
    statusTransferred: '🔄 Transfer',

    // Pet species
    speciesDog: '🐕 Dog', speciesCat: '🐈 Cat', speciesRabbit: '🐇 Rabbit',
    speciesBird: '🦜 Bird', speciesOther: '🐾 Other',

    // Procedure categories
    catPrevention: 'Prevention', catDiagnostics: 'Diagnostics', catSurgery: 'Surgery',
    catDental: 'Dental', catGrooming: 'Grooming', catChip: 'Identification', catOther: 'Other',
  }
};

const LANG_ORDER = ['et', 'ru', 'en'];

const i18n = {
  lang: localStorage.getItem('vc_lang') || 'et',

  t(key) {
    return (TRANSLATIONS[this.lang] || TRANSLATIONS.et)[key] || (TRANSLATIONS.et[key]) || key;
  },

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('vc_lang', lang);
    this.closeDropdown();
    this.applyToPage();
  },

  showDropdown(btn) {
    const dd = document.getElementById('langDropdown');
    if (!dd) return;
    const isOpen = dd.classList.contains('open');
    this.closeDropdown();
    if (!isOpen) dd.classList.add('open');
  },

  closeDropdown() {
    document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
  },

  applyToPage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });
    // Lang button shows current language
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.textContent = this.lang.toUpperCase();
    });
    // Update lang dropdown active state
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === this.lang);
    });
    document.documentElement.lang = this.lang;
  },

  init() {
    this.applyToPage();
  }
};

// theme
const theme = {
  current: localStorage.getItem('vc_theme') || 'light',

  apply() {
    document.documentElement.setAttribute('data-theme', this.current);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.textContent = this.current === 'dark' ? '☀️' : '🌙';
    });
  },

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('vc_theme', this.current);
    this.apply();
  },

  init() { this.apply(); }
};

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-switcher')) {
    i18n.closeDropdown();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  theme.init();
  i18n.init();
});
