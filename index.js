const bolgeler = {
  raum_sud: {
    ucretler: {
      "1_person": { betrag: 541.0, qm: 50 },
      "2_personen": { betrag: 656.0, qm: 60 },
      "3_personen": { betrag: 775.0, qm: 75 },
      "4_personen": { betrag: 881.0, qm: 87 },
      "5_personen": { betrag: 961.0, qm: 99 },
      zuschlag_jede_weitere_person: { betrag: 115.0, qm: 12 },
    },
    koyler: {
      biebesheim: "Biebesheim",
      gernsheim: "Gernsheim",
      riedstadt: "Riedstadt",
      stockstadt: "Stockstadt",
    },
  },
  raum_mitte: {
    ucretler: {
      "1_person": { betrag: 591.0, qm: 50 },
      "2_personen": { betrag: 722.0, qm: 60 },
      "3_personen": { betrag: 832.0, qm: 75 },
      "4_personen": { betrag: 938.0, qm: 87 },
      "5_personen": { betrag: 1177.0, qm: 99 },
      zuschlag_jede_weitere_person: { betrag: 143.0, qm: 12 },
    },
    koyler: {
      gross_gerau: "Groß-Gerau",
      buttelborn: "Büttelborn",
      nauheim: "Nauheim",
      trebur: "Trebur",
    },
  },
  raum_nord: {
    ucretler: {
      "1_person": { betrag: 572.0, qm: 50 },
      "2_personen": { betrag: 720.0, qm: 60 },
      "3_personen": { betrag: 868.0, qm: 75 },
      "4_personen": { betrag: 1158.0, qm: 87 },
      "5_personen": { betrag: 1555.0, qm: 99 },
      zuschlag_jede_weitere_person: { betrag: 188.0, qm: 12 },
    },
    koyler: {
      bischofsheim: "Bischofsheim",
      ginsheim_gustavsburg: "Ginsheim-Gustavsburg",
      kelsterbach: "Kelsterbach",
      raunheim: "Raunheim",
      russelsheim: "Rüsselsheim",
      morfelden_walldorf: "Mörfelden-Walldorf",
    },
  },
}

const house_qm = document.getElementById("house_qm")
const nebenkosten_multiplier = document.getElementById("nebenkosten_multiplier")
const heisung_multiplier = document.getElementById("heisung_multiplier")
const yerlerSelect = document.getElementById("yerler")
const kisiSayisiInput = document.getElementById("number_of_person")
const hesaplaButton = document.getElementById("hesapla")
const gerekliQmSpan = document.getElementById("gerekliQm")
const kiraUcretiSpan = document.getElementById("kiraUcreti")
const bilgiAlani = document.getElementById("bilgiAlani")
const seciliYerDiv = document.getElementById("seciliYer")
const toplamNebenkostenSpan = document.getElementById("toplamNebenkosten")
const toplamHeizungSpan = document.getElementById("toplamHeizung")
const kaltmieteSpan = document.getElementById("kaltmiete")
const sonuclarDiv = document.getElementById("sonuclar")
const formGroups = document.querySelectorAll(".form_group")
const resetButton = document.getElementById("reset")

bilgiAlani.style.display = "none"
nebenkosten_multiplier.value = 2.4
heisung_multiplier.value = 2.4

for (const bolgeKey in bolgeler) {
  const bolge = bolgeler[bolgeKey]
  const optgroup = document.createElement("optgroup")
  optgroup.label = bolgeKey.replace(/_/g, " ").toUpperCase()

  for (const koyKey in bolge.koyler) {
    const option = document.createElement("option")
    option.value = bolgeKey + "-" + koyKey
    option.text = bolge.koyler[koyKey]
    optgroup.appendChild(option)
  }

  yerlerSelect.appendChild(optgroup)
}

function bilgileriGuncelle() {
  const selectedValue = yerlerSelect.value

  const kisiSayisi = parseInt(kisiSayisiInput.value)

  if (selectedValue && !isNaN(kisiSayisi) && kisiSayisi >= 1) {
    const [selectedRegion, selectedKoy] = selectedValue.split("-")

    const regionData = bolgeler[selectedRegion]

    let uygunUcretBilgisi = null

    if (kisiSayisi <= 5) {
      const kisiKey = kisiSayisi === 1 ? "1_person" : `${kisiSayisi}_personen`
      uygunUcretBilgisi = regionData.ucretler[kisiKey]
    } else {
      uygunUcretBilgisi = regionData.ucretler["5_personen"]
      const ekKisiSayisi = kisiSayisi - 5
      const ekUcret =
        regionData.ucretler["zuschlag_jede_weitere_person"].betrag *
        ekKisiSayisi
      const ekQm =
        regionData.ucretler["zuschlag_jede_weitere_person"].qm * ekKisiSayisi
      uygunUcretBilgisi = {
        betrag: uygunUcretBilgisi.betrag + ekUcret,
        qm: uygunUcretBilgisi.qm + ekQm,
      }
    }
    if (uygunUcretBilgisi) {
      gerekliQmSpan.textContent = uygunUcretBilgisi.qm + " m² "
      kiraUcretiSpan.textContent =
        uygunUcretBilgisi.betrag + " EURO  (Kaltmite + Nebenkosten)"
      bilgiAlani.style.display = "block"
    } else {
      bilgiAlani.style.display = "none"
    }
  } else {
    gerekliQmSpan.textContent = ""
    kiraUcretiSpan.textContent = ""
    bilgiAlani.style.display = "none"
  }
}

yerlerSelect.addEventListener("change", () => {
  const selectedOption = yerlerSelect.options[yerlerSelect.selectedIndex]
  if (selectedOption) {
    // Überprüfen, ob eine Option ausgewählt ist
    const selectedText = selectedOption.text
    seciliYerDiv.textContent = "Ausgewählter Ort: " + selectedText
  }
  bilgileriGuncelle() // Korrekter Funktionsaufruf
})

kisiSayisiInput.addEventListener("input", bilgileriGuncelle)

window.addEventListener("load", () => {
  if (yerlerSelect.options.length > 1) {
    yerlerSelect.selectedIndex = 0
    bilgileriGuncelle()
  }
})

hesaplaButton.addEventListener("click", () => {
  const qm = parseFloat(house_qm.value)
  const nebenkosten = parseFloat(nebenkosten_multiplier.value)
  const heizung = parseFloat(heisung_multiplier.value)
  // Korrektur: Den *Inhalt* des kiraUcretiSpan holen und parsen
  const kiraString = kiraUcretiSpan.textContent.split(" ")[0] // "123 € (Kaltmiete + Nebenkosten)" -> "123"
  const kira = parseFloat(kiraString)

  if (
    isNaN(qm) ||
    isNaN(kira) ||
    isNaN(nebenkosten) ||
    isNaN(heizung) ||
    qm < 0 ||
    kira < 0 ||
    nebenkosten < 0 ||
    heizung < 0
  ) {
    alert("Lütfen geçerli sayısal değerler girin.")
    return
  }
  formGroups.forEach((formGroup) => {
    formGroup.style.display = "none"
  })
  hesaplaButton.style.display = "none"
  const toplamNebenkosten = qm * nebenkosten
  const toplamHeizung = qm * heizung
  const kaltmiete = kira - toplamNebenkosten

  toplamNebenkostenSpan.textContent = toplamNebenkosten.toFixed(2)
  toplamHeizungSpan.textContent = toplamHeizung.toFixed(2)
  kaltmieteSpan.textContent = kaltmiete.toFixed(2)

  sonuclarDiv.style.display = "block"
})

resetButton.addEventListener("click", () => {
  formGroups.forEach((formGroup) => {
    formGroup.style.display = "block"
  })
  hesaplaButton.style.display = "block"
  bilgiAlani.style.display = "none"
  house_qm.value = 0
  nebenkosten_multiplier.value = 2.4
  heisung_multiplier.value = 2.4
  yerlerSelect.selectedIndex = 0 // Seçimi sıfırla
  kisiSayisiInput.value = 1
  gerekliQmSpan.textContent = ""
  kiraUcretiSpan.textContent = ""
  toplamNebenkostenSpan.textContent = ""
  toplamHeizungSpan.textContent = ""
  kaltmieteSpan.textContent = ""
  sonuclarDiv.style.display = "none"
  seciliYerDiv.textContent = ""
})
