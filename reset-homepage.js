// Script to reset homepage content to default
const resetHomepageContent = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🔄 Resetting homepage content to default...\n');
  
  const defaultContent = {
    hero: {
      title: "Desa Wisata, Desa Budaya, Desa Bejalen",
      subtitle: "Dukungan dan kedatangan Anda tidak hanya menciptakan pengalaman bermakna, tetapi juga memberdayakan ekonomi lokal",
      backgroundImage: "/header-home.png"
    },
    about: {
      title: "Desa Wisata Untuk Masa Berkelanjutan",
      description: "Desa Bejalen merupakan salah satu destinasi desa wisata yang terletak di Kecamatan Ambarawa, Kabupaten Semarang, Provinsi Jawa Tengah. Desa ini terletak tepat di pinggir Danau Rawa Pening yang dikelilingi oleh rangkaian pegunungan, yaitu Gunung Merbabu, Gunung Telomoyo, dan Gunung Ungaran."
    },
    rawaPening: {
      title: "Vast Expanse of Swamp Water",
      subtitle: "Desa Wisata Bejalen",
      description: "Menyegarkan pikiran di akhir pekan tidak memerlukan rencana wisata yang mewah. Rekreasi sederhana di Rawa Pening saja bisa jadi kegiatan yang menyenangkan.",
      image: "/header-home2.png"
    },
    destinations: {
      title: "Pada Desa Hepi Desa Bejalen",
      subtitle: "Destinasi"
    }
  };

  try {
    console.log('📍 Resetting content...');
    const response = await fetch(`${baseUrl}/api/homepage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: defaultContent
      })
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Content reset successfully');
      console.log('📊 Hero title:', result.data.content.hero.title);
      console.log('📊 About title:', result.data.content.about.title);
      console.log('📊 Version:', result.data.version);
    } else {
      console.log('❌ Failed to reset content:', result.error);
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n🏁 Reset completed!');
};

resetHomepageContent();
