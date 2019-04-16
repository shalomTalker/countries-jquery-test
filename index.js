const container = $('#countries');// browser tag container
let localCountries = JSON.parse(localStorage.getItem('localCountries'))
const selectOptions = JSON.parse(optionsJSON)

const findCountryIndex = function (localCountries, numericCode) {
    for (let i = 0; i < localCountries.length; i++) {
        if (localCountries[i].numericCode === numericCode) {
            return i;
        }
    }
}
const generateUrl = function (key, value) {
    if (key !== 'all') {
        return `https://restcountries.eu/rest/v2/${key}/${value}`
    } else {
        return `https://restcountries.eu/rest/v2/all`

    }
}

const handleSubmit = function (e) {
    const textInput = $('[name=searchText]')[0]
    const selectInput = $('[name=selectKey]')[0]
    const textValue = textInput.value
    const selectValue = selectInput.value


    const url = generateUrl(selectValue, textValue)
    fetchCountries(url)
}

const deleteCountry = function (numericCode) {

    localCountries = JSON.parse(localStorage.getItem('localCountries'))
    let index = findCountryIndex(localCountries,numericCode)

    $(`[data-id=${numericCode}]`).remove()
    localCountries.splice(index, 1)
    localStorage.setItem('localCountries', JSON.stringify(localCountries))
}

const fetchCountries = function (url) {
    let countriesList = [];
    $.ajax({
        url,
        method: 'GET',
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                const { name, capital, alpha3Code, region, flag, numericCode } = data[i];
                const countryObject = {
                    name: name,
                    capital: capital,
                    alpha3Code: alpha3Code,
                    region: region,
                    flag: flag,
                    numericCode: numericCode
                }
                countriesList.push(countryObject);
            }

            renderCountries(countriesList)
            localStorage.setItem("localCountries", JSON.stringify(countriesList))

        },
        error: function (error) {
            alert(error)
        }
    })
}

const renderSelect = async function () {
    const form = $('<form>', {
        submit: function (e) {
            e.preventDefault()
            handleSubmit(e)
        }
    })
    $('<input>', {
        type: "text",
        name: 'searchText'
    }).appendTo(form)


    const select = $('<select>', {
        class: 'countries-select',
        name: 'selectKey'
    })

    for (let i = 0; i < selectOptions.length; i++) {
        const { display, searchKey } = selectOptions[i];
        $('<option>', {
            text: display,
            value: searchKey
        }).appendTo(select)
    }
    select.appendTo(form)

    $('<input>', {
        type: 'submit',
        value: 'Search'
    }).appendTo(form)

    form.prependTo($('body'))

}

const renderCountries = function (list) {
    $('.row').empty()
    for (let i = 0; i < list.length; i++) {
        const { name, capital, alpha3Code, region, flag, numericCode } = list[i]

        let card = $('<div>', { class: name, 'data-id': numericCode })

        $('<img>', {
            src: flag,
            alt: name
        }).appendTo(card)

        $('<h3>', {
            text: 'Name : ' + name
        }).appendTo(card)

        $('<span>', {
            text: 'Capital : ' + capital
        }).appendTo(card)

        $('<span>', {
            text: 'Alpha-Code : ' + alpha3Code
        }).appendTo(card)

        $('<span>', {
            text: 'Region : ' + region
        }).appendTo(card)

        $('<button>', {
            text: 'DEL',
            click: function (e) {
                deleteCountry(numericCode)
            }
        }).appendTo(card)

        card.appendTo(container)

    }
}

renderSelect()

if (localCountries && localCountries.length !== 0) {
    renderCountries(localCountries)
} else {
    fetchCountries('https://restcountries.eu/rest/v2/all')
}
