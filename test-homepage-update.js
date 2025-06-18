// Test script for Homepage Update API
const testHomepageUpdate = async () => {
  const url = 'http://localhost:3000/api/homepage';
  
  console.log('🧪 Testing Homepage Update API...');
  
  const testContent = {
    hero: {
      title: "Updated: Desa Wisata, Desa Budaya, Desa Bejalen",
      subtitle: "Test Update: Dukungan dan kedatangan Anda tidak hanya menciptakan pengalaman bermakna, tetapi juga memberdayakan ekonomi lokal",
      backgroundImage: "/header-home.png"
    },
    about: {
      title: "Updated: Desa Wisata Untuk Masa Berkelanjutan",
      description: "Test Update: Desa Bejalen merupakan salah satu destinasi desa wisata yang terletak di Kecamatan Ambarawa, Kabupaten Semarang, Provinsi Jawa Tengah."
    },
    rawaPening: {
      title: "Updated: Vast Expanse of Swamp Water",
      subtitle: "Updated: Desa Wisata Bejalen",
      description: "Test Update: Menyegarkan pikiran di akhir pekan tidak memerlukan rencana wisata yang mewah.",
      image: "/header-home2.png"
    },
    destinations: {
      title: "Updated: Pada Desa Hepi Desa Bejalen",
      subtitle: "Updated: Destinasi"
    }
  };

  try {
    console.log('📍 PUT', url);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: testContent
      })
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Success:', result.message);
      console.log('📊 Updated Content Keys:', Object.keys(result.data.content));
    } else {
      console.log('❌ Failed:', result.error || 'Unknown error');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

testHomepageUpdate();
