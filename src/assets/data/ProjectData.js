import pillPicture from '../img/card_example1.png'
import smokePicture from "../img/card_example2.png"
import emissionPicture from "../img/card_example3.png"
import mobilePicture from "../img/card_example4.png"

import HelvetasLogo from "../img/HelvetasLogo.jpg"
import MozSurLogo from "../img/MozSurLogo.jpg"

const cardData = [
    {
        id: 1,
        title: "Pill Organiser for Self-Medication",
        organisation: "Fundaćion Mozambique Sur",
        organisationLogo: MozSurLogo,
        status: "Adopted (Department of Bioengineering)",
        location: "Casa do Gaiato-Maputo, Boanne, Mozambique",
        shortDescription: "A pill organiser for orphans in Casa do Gaiato-Maputo to self medicate appropriately. Motivated by the poor disease management due to limited number of healthcare workers.",
        detailedDescription: "Casa do Gaiato is an orphanage (amongst other things) 2 hours away from Maputo. In a country where 11.5% of the population is infected with HIV/AIDS, the orphanage is not exempt from this statistic. With the few health workers and significant treatment that is retroviral drugs, children find themselves undereducated and taking a lot of time and resources from the healthcare centre at the orphanage. Thus a proposed project by Fundación Mozambique Sur is the creation of a pillbox that informs the children when they need to take a specific pill. In addition to this, disease management is known to be poor but it is not quantified, so implementing a data acquisition process can shed light on how poor the disease management is, and it can aid to identify the children that are at higher risk of forgetting, and behavioural trends associated with their activities and age.",
        images: [pillPicture],
        documents: []
    },
    {
        id: 2,
        title: "Low-Smoke Cooking Environment",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Adopted (Engineering Change)",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Develop a low-cost stove that produced little or no smoke or an efficient extractor system that can be coupled to current cooking methods.",
        detailedDescription: "Smoke is the main cause of cataracts and respiratory diseases in rural Mozambique, this comes as a result of using charcoal and wood to cook in closed homes with little ventilation. Thus Helvetas has proposed a two sided project: a low-cost extractor mechanism for these cooking environments or the development of a stove that produces negligible amounts of harmful smoke.",
        images: [smokePicture],
        documents: []
    },
    {
        id: 3,
        title: "Low Emission Cashew Nut Processor",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Adopted (Engineering Change)",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Develop a Cashew Nut processor with low CO2 emissions, as current technologies are highly polluting.",
        detailedDescription: "Cashew nuts are one of the main produces of Mozambique. This leads to large amounts of cashew nut residue that comes from the processing. Currently this residue incurs a cost in its’ disposal, thus a proposed project improve productivity, job and value value creation is the re-purposing of the residue to constructive means. This is an opportunity to reduce waste and to activate the local economy. This is a project proposed by Helvetas.",
        images: [emissionPicture],
        documents: []
    },  
    {
        id: 4,
        title: "Mobile Grain Network-Marketplace",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Unadopted",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Create a mobile phone application that informs of the fair local market price for different kinds of food productions.",
        detailedDescription: "Approximately, 80% of Mozambicans live off agriculture. However, farmers and herders often are misguided about the real price of their produce by middle-men that are in charge of moving the produce from the farms to the hubs for sale. The middle-men despite facilitating the market and storing grain, they take large cuts, and often inflating the price to such degree that when farmers want to buy food towards the end of the dry-season, the grain is far too expensive. This leads to people in rural areas from experiencing the highest incidences of malnutrition and malnourishment. Mozambicans use routinely their mobile phones, despite the basic operations that these run (in comparison to high-end smartphones) thus this poses an opportunity to create a rudimentary system that could allow a fair pricing of produce, in accordance to supply and thus a fair remuneration for their work.",
        images: [mobilePicture],
        documents: []
    },
    {
        id: 5,
        title: "Pill Organiser for Self-Medication",
        organisation: "Fundaćion Mozambique Sur",
        organisationLogo: MozSurLogo,
        status: "Adopted (Department of Bioengineering)",
        location: "Casa do Gaiato-Maputo, Boanne, Mozambique",
        shortDescription: "A pill organiser for orphans in Casa do Gaiato-Maputo to self medicate appropriately. Motivated by the poor disease management due to limited number of healthcare workers.",
        detailedDescription: "Casa do Gaiato is an orphanage (amongst other things) 2 hours away from Maputo. In a country where 11.5% of the population is infected with HIV/AIDS, the orphanage is not exempt from this statistic. With the few health workers and significant treatment that is retroviral drugs, children find themselves undereducated and taking a lot of time and resources from the healthcare centre at the orphanage. Thus a proposed project by Fundación Mozambique Sur is the creation of a pillbox that informs the children when they need to take a specific pill. In addition to this, disease management is known to be poor but it is not quantified, so implementing a data acquisition process can shed light on how poor the disease management is, and it can aid to identify the children that are at higher risk of forgetting, and behavioural trends associated with their activities and age.",
        images: [pillPicture],
        documents: []
    },
    {
        id: 6,
      title: "Low-Smoke Cooking Environment",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Adopted (Engineering Change)",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Develop a low-cost stove that produced little or no smoke or an efficient extractor system that can be coupled to current cooking methods.",
        detailedDescription: "Smoke is the main cause of cataracts and respiratory diseases in rural Mozambique, this comes as a result of using charcoal and wood to cook in closed homes with little ventilation. Thus Helvetas has proposed a two sided project: a low-cost extractor mechanism for these cooking environments or the development of a stove that produces negligible amounts of harmful smoke.",
        images: [smokePicture],
        documents: []
    },
    {
        id: 7,
        title: "Low Emission Cashew Nut Processor",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Adopted (Engineering Change)",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Develop a Cashew Nut processor with low CO2 emissions, as current technologies are highly polluting.",
        detailedDescription: "Cashew nuts are one of the main produces of Mozambique. This leads to large amounts of cashew nut residue that comes from the processing. Currently this residue incurs a cost in its’ disposal, thus a proposed project improve productivity, job and value value creation is the re-purposing of the residue to constructive means. This is an opportunity to reduce waste and to activate the local economy. This is a project proposed by Helvetas.",
        images: [emissionPicture],
        documents: []
    },  
    {
        id: 8,
        title: "Mobile Grain Network-Marketplace",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Unadopted",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Create a mobile phone application that informs of the fair local market price for different kinds of food productions.",
        detailedDescription: "Approximately, 80% of Mozambicans live off agriculture. However, farmers and herders often are misguided about the real price of their produce by middle-men that are in charge of moving the produce from the farms to the hubs for sale. The middle-men despite facilitating the market and storing grain, they take large cuts, and often inflating the price to such degree that when farmers want to buy food towards the end of the dry-season, the grain is far too expensive. This leads to people in rural areas from experiencing the highest incidences of malnutrition and malnourishment. Mozambicans use routinely their mobile phones, despite the basic operations that these run (in comparison to high-end smartphones) thus this poses an opportunity to create a rudimentary system that could allow a fair pricing of produce, in accordance to supply and thus a fair remuneration for their work.",
        images: [mobilePicture],
        documents: []
    },
    {
        id: 9,
        title: "Pill Organiser for Self-Medication",
        organisation: "Fundaćion Mozambique Sur",
        organisationLogo: MozSurLogo,
        status: "Adopted (Department of Bioengineering)",
        location: "Casa do Gaiato-Maputo, Boanne, Mozambique",
        shortDescription: "A pill organiser for orphans in Casa do Gaiato-Maputo to self medicate appropriately. Motivated by the poor disease management due to limited number of healthcare workers.",
        detailedDescription: "Casa do Gaiato is an orphanage (amongst other things) 2 hours away from Maputo. In a country where 11.5% of the population is infected with HIV/AIDS, the orphanage is not exempt from this statistic. With the few health workers and significant treatment that is retroviral drugs, children find themselves undereducated and taking a lot of time and resources from the healthcare centre at the orphanage. Thus a proposed project by Fundación Mozambique Sur is the creation of a pillbox that informs the children when they need to take a specific pill. In addition to this, disease management is known to be poor but it is not quantified, so implementing a data acquisition process can shed light on how poor the disease management is, and it can aid to identify the children that are at higher risk of forgetting, and behavioural trends associated with their activities and age.",
        images: [pillPicture],
        documents: []
    },
    {
        id: 10,
        title: "Low-Smoke Cooking Environment",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Adopted (Engineering Change)",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Develop a low-cost stove that produced little or no smoke or an efficient extractor system that can be coupled to current cooking methods.",
        detailedDescription: "Smoke is the main cause of cataracts and respiratory diseases in rural Mozambique, this comes as a result of using charcoal and wood to cook in closed homes with little ventilation. Thus Helvetas has proposed a two sided project: a low-cost extractor mechanism for these cooking environments or the development of a stove that produces negligible amounts of harmful smoke.",
        images: [smokePicture],
        documents: []
    },
    {
        id: 11,
        title: "Low Emission Cashew Nut Processor",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Adopted (Engineering Change)",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Develop a Cashew Nut processor with low CO2 emissions, as current technologies are highly polluting.",
        detailedDescription: "Cashew nuts are one of the main produces of Mozambique. This leads to large amounts of cashew nut residue that comes from the processing. Currently this residue incurs a cost in its’ disposal, thus a proposed project improve productivity, job and value value creation is the re-purposing of the residue to constructive means. This is an opportunity to reduce waste and to activate the local economy. This is a project proposed by Helvetas.",
        images: [emissionPicture],
        documents: []
    },  
    {
        id: 12,
        title: "Mobile Grain Network-Marketplace",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Unadopted",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Create a mobile phone application that informs of the fair local market price for different kinds of food productions.",
        detailedDescription: "Approximately, 80% of Mozambicans live off agriculture. However, farmers and herders often are misguided about the real price of their produce by middle-men that are in charge of moving the produce from the farms to the hubs for sale. The middle-men despite facilitating the market and storing grain, they take large cuts, and often inflating the price to such degree that when farmers want to buy food towards the end of the dry-season, the grain is far too expensive. This leads to people in rural areas from experiencing the highest incidences of malnutrition and malnourishment. Mozambicans use routinely their mobile phones, despite the basic operations that these run (in comparison to high-end smartphones) thus this poses an opportunity to create a rudimentary system that could allow a fair pricing of produce, in accordance to supply and thus a fair remuneration for their work.",
        images: [mobilePicture],
        documents: []
    },
    {
        id: 13,
        title: "Pill Organiser for Self-Medication",
        organisation: "Fundaćion Mozambique Sur",
        organisationLogo: MozSurLogo,
        status: "Adopted (Department of Bioengineering)",
        location: "Casa do Gaiato-Maputo, Boanne, Mozambique",
        shortDescription: "A pill organiser for orphans in Casa do Gaiato-Maputo to self medicate appropriately. Motivated by the poor disease management due to limited number of healthcare workers.",
        detailedDescription: "Casa do Gaiato is an orphanage (amongst other things) 2 hours away from Maputo. In a country where 11.5% of the population is infected with HIV/AIDS, the orphanage is not exempt from this statistic. With the few health workers and significant treatment that is retroviral drugs, children find themselves undereducated and taking a lot of time and resources from the healthcare centre at the orphanage. Thus a proposed project by Fundación Mozambique Sur is the creation of a pillbox that informs the children when they need to take a specific pill. In addition to this, disease management is known to be poor but it is not quantified, so implementing a data acquisition process can shed light on how poor the disease management is, and it can aid to identify the children that are at higher risk of forgetting, and behavioural trends associated with their activities and age.",
        images: [pillPicture],
        documents: []
    },
    {
        id: 14,
        title: "Low-Smoke Cooking Environment",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Adopted (Engineering Change)",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Develop a low-cost stove that produced little or no smoke or an efficient extractor system that can be coupled to current cooking methods.",
        detailedDescription: "Smoke is the main cause of cataracts and respiratory diseases in rural Mozambique, this comes as a result of using charcoal and wood to cook in closed homes with little ventilation. Thus Helvetas has proposed a two sided project: a low-cost extractor mechanism for these cooking environments or the development of a stove that produces negligible amounts of harmful smoke.",
        images: [smokePicture],
        documents: []
    },
    {
        id: 15,
        title: "Low Emission Cashew Nut Processor",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Adopted (Engineering Change)",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Develop a Cashew Nut processor with low CO2 emissions, as current technologies are highly polluting.",
        detailedDescription: "Cashew nuts are one of the main produces of Mozambique. This leads to large amounts of cashew nut residue that comes from the processing. Currently this residue incurs a cost in its’ disposal, thus a proposed project improve productivity, job and value value creation is the re-purposing of the residue to constructive means. This is an opportunity to reduce waste and to activate the local economy. This is a project proposed by Helvetas.",
        images: [emissionPicture],
        documents: []
    },  
    {
        id: 16,
        title: "Mobile Grain Network-Marketplace",
        organisation: "Helvetas Swiss Intercooperation",
        organisationLogo: HelvetasLogo,
        status: "Unadopted",
        location: "Cabo Delgado, Mozambique",
        shortDescription: "Create a mobile phone application that informs of the fair local market price for different kinds of food productions.",
        detailedDescription: "Approximately, 80% of Mozambicans live off agriculture. However, farmers and herders often are misguided about the real price of their produce by middle-men that are in charge of moving the produce from the farms to the hubs for sale. The middle-men despite facilitating the market and storing grain, they take large cuts, and often inflating the price to such degree that when farmers want to buy food towards the end of the dry-season, the grain is far too expensive. This leads to people in rural areas from experiencing the highest incidences of malnutrition and malnourishment. Mozambicans use routinely their mobile phones, despite the basic operations that these run (in comparison to high-end smartphones) thus this poses an opportunity to create a rudimentary system that could allow a fair pricing of produce, in accordance to supply and thus a fair remuneration for their work.",
        images: [mobilePicture],
        documents: []
    }   
]

export default cardData