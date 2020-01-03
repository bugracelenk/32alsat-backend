const mongoose = require("mongoose");
const paginate = require("../utils/paginate");

exports.ilan_olustur = async (req, res, next) => {
  const args = req.body;

  // let _category = await mongoose
  //   .model("Category")
  //   .findOne({ category_name: args.category });

  let _category = await mongoose.model("Category").create({ category_name: args.category });

  if (!_category)
    return res.status(500).json({
      error: "Kategori getirilirken bir hata oluştu."
    });


  let tag_ids = args.tags.map(tag => {
    mongoose.model("Tag").create({ tag_name: tag }).then(result => {
      return result._id;
    })
    
  })

  const ilan_veri = {
    title: args.title,
    price: args.price,
    desc: args.desc,
    images: args.images.length > 0 ? args.images : [],
    listed_by: req.userData.profile_id,
    category: _category._id,
    tags: tag_ids
  };

  let ilan = await mongoose.model("Ilan").create(ilan_veri);

  if (ilan)
    return res.status(201).json({
      message: "İlan oluşturuldu, admin onayı bekliyor.",
      request: {
        type: "GET",
        url: `http://localhost:3000/api/ilanlar/${ilan._id}`
      }
    });
  else
    return res.status(500).json({
      error: "İlan oluşturulurken bir hata oluştu, admin ile iletişime geç"
    });
};

/*
args.tags = ["utu", "kalem"]
args.tags.map(tag => {})
tag = utu,
tag = kalem

ilan_veri.tags = [ObjectID, ObjectID]

let my_name = "bugra"

`my name is ${my_name}` => "my name is bugra"
"my name is " + my_name


req.body.images = ["şlksafsşaskfaslşfkaf.com/şaskşaskfgşl", "aşslkfaşlkfasşlkf.com/asşfkasşlfkasşlfk"]
req.body.images = []

ilan_veri.images = ["şlksafsşaskfaslşfkaf.com/şaskşaskfgşl", "aşslkfaşlkfasşlkf.com/asşfkasşlfkasşlfk"]
ilan_veri.images = []

if(args.images.length > 0) {} else {}
args.images.length > 0 ? {} : {}
*/

exports.get_ilanlar = (req, res, next) => {
  let args = {
    limit: parseInt(req.params.limit),
    skip: parseInt(req.params.skip)
  }
  mongoose
    .model("Ilan")
    .find({ isListing: true, isApproved: true })
    .sort({ updated_at: -1 })
    .limit(paginate.setLimit(args))
    .skip(paginate.setSkip(args))
    .exec()
    .then(result => {
      if (result.length > 0) {
        const response = {
          count: result.length,
          ilanlar: result.map(ilan => {
            return {
              title: ilan.title,
              price: ilan.price,
              thumbnail: ilan.thumbnail,
              request: {
                type: "GET",
                url: `http://localhost:3000/api/ilanlar/${ilan._id}`
              }
            };
          })
        };

        return res.status(200).json(response);
      } else {
        return res.status(200).json({
          message: "Listelenecek ilan yok."
        });
      }
    });
};

exports.get_ilan_by_id = async (req, res, next) => {
  const ilan_id = req.params.ilan_id;

  let result = await mongoose
    .model("Ilan")
    .find({ _id: ilan_id })
    .populate({
      path: "listed_by",
      select: "-birth_date -ilanlar -urunler -followers -following -begendigi_ilanlar -adres -engellenen_kullanicilar -telefon_no -user_id -isHidden -store_name",
      populate: { 
        path: "profile_type",
        select: "-profile_id -user_id"
      }
    })
    .populate("category", "category_name")
    .populate("tags", "tag_name");

  if(result)  return res.status(200).json(result);
  else return res.status(400).json({
    error: "Verilen ID için ilan bulunamadı."
  })
};

exports.update_ilan = async (req, res, next) => {
  const ilan_id = req.params.ilan_id;

  let updateOps = {};
  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }

  updateOps["updated_at"] = Date.now();

  let old_ilan = await mongoose.model("Ilan").findOne({ _id: ilan_id });

  mongoose.model("Ilan").findOneAndUpdate({ _id: ilan_id }, { $set: updateOps }).exec().then(result => {
    if(result !== old_ilan) {
      return res.status(200).json({
        message: "İlan Başarıyla Güncellendi",
        request: {
          type: "GET",
          url: `http://locahost:3000/api/ilanlar/${result._id}`
        }
      })
    }else {
      return res.status(500).json({
        error: "İlan güncellenirken bir hata oluştu, lütfen tekrar deneyiniz ve admin ile iletişime geçiniz."
      })
    }
  }).catch(err => {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    })
  })
}

/*

title -> İkinci El Araba => Doktordan temiz araba
price -> 2000 => 1500

[
  {
    propName: "title",
    value: "Doktordan temiz araba"
  },
  {
    propName: "price",
    value: 1500
  }
]

ops = {
    propName: "title",
    value: "Doktordan temiz araba"
  }

ops = {
    propName: "price",
    value: 1500
  }



for(ops in req.body) {
  updateOps[ops.propName] = ops.value
}
*/

exports.like_ilan = async (req, res, next) => {
  const ilan_id = req.params.ilan_id;

  let ilan = await mongoose.model("Ilan").findOne({ _id: ilan_id });

  ilan.like_count += 1;
  
  let result = await ilan.save();

  if(result) {
    return res.status(200).json({
      message: "İlan Beğenildi",
      request: {
        type: "GET",
        url: `http://locahost:3000/api/ilanlar/${result._id}`
      }
    });
  }else {
    return res.status(500).json({
      error: "İlan beğenilirken bir hata ile karşılaşıldı. lütfen tekrar deneyiniz ve admin ile iletişime geçiniz."
    })
  }
}

exports.ilan_favla = async (req, res, next) => {
  /*
  ilanın fav sayısını bir artır
  ilanın favlayan kullanıcılar kısmına profil_id'sini ekle
  profilde favlanan ilanlar kısmına bu ilanı ekle
  */

  const ilan_id = req.params.ilan_id;

  let ilan = await mongoose.model("Ilan").findOne({ _id: ilan_id });
  let profile = await mongoose.model("Profile").findOne(({ _id: req.userData.profile_id }));

  ilan.fav_count += 1;
  ilan.faved_users.push(req.userData.profile_id);
  profile.fav_ilanlar.push(ilan_id);

  let ilan_res = await ilan.save();
  let profile_res = await profile.save();

  if(ilan_res && profile_res) {
    return res.status(200).json({
      message: "İlan favorilere eklendi",
      request: {
        path: "GET",
        url: `http://localhost:3000/api/profile/favs`
      }
    })
  }else if(!ilan_res) {
    return res.status(500).json({
      error: "İlan favorilere eklenirken bir hata oluştu, tekrar deneyiniz ve admin ile iletişime geçiniz."
    })
  }else if(!profile_res) {
    return res.status(500).json({
      error: "İlan profile eklenirken bir hata oluştu, tekrar deneyiniz ve admin ile iletişime geçiniz."
    })
  }
}

//exports.search
//exports.unfav
//exports.delete
//exports.ilanlarımı_getir