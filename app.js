/**
 * Created by tehetenamasresha on 12/09/2017.
 */
const prod01 = document.getElementById("prod_01")
const $form = document.querySelector('#add-form')
const $table = document.querySelector('#list-table')
const saveForm = document.querySelector('#saveForm')



$form.addEventListener('submit', function (event) {
    event.preventDefault()

    const name = document.querySelector('#name').value
    const $row = document.createElement('tr')
    $row.innerHTML = `
    <td>
      ${name}
    </td>
    <td name="amt" placeholder="00">
     
    </td>
    <td>
      -
    </td>
    <td class="actions">
      <a href="#" data-action="edit">edit</a> |
      <a href="#" data-action="delete">delete</a>
    </td>
  `
    $table.appendChild($row)

    $form.reset()
})

$table.addEventListener('click', function (event) {
    event.preventDefault()

    const $button = event.target
    const $row = $button.closest('tr')
    const action = $button.dataset.action
    let $inputs
    let name
    let contact
    let note

    if (action === 'delete') {
        $row.remove()
    }

    if (action === 'edit') {
        const $cells = $row.querySelectorAll('td')
        name = $cells[0].textContent.trim()
        contact = $cells[1].textContent.trim()
        note = $cells[2].textContent.trim()

        $row.innerHTML = `
      <td>
        <input value="${name}" data-original="${name}">
      </td>
      <td>
        <input value="${contact}" data-original="${contact}">
      </td>
      <td>
        <textarea data-original="${note}">${note}</textarea>
      </td>
      <td class="actions">
        <button data-action="save">save</button>
        <a href="#" data-action="cancel">cancel</a>
      </td>
    `
    }

    if (action === 'save') {
        $inputs = $row.querySelectorAll('input, textarea')
        name = $inputs[0].value
        contact = $inputs[1].value
        note = $inputs[2].value

        $row.innerHTML = `
      <td>
        ${name}
      </td>
      <td name="amt">
        ${contact}
      </td>
      <td>
        ${note}
      </td>
      <td class="actions">
        <a href="#" data-action="edit">edit</a> |
        <a href="#" data-action="delete">delete</a>
      </td>
    `
        console.log(name)

    }

    if (action === 'cancel') {
        $inputs = $row.querySelectorAll('input, textarea')
        name = $inputs[0].dataset.original
        contact = $inputs[1].dataset.original
        note = $inputs[2].dataset.original

        $row.innerHTML = `
      <td>
        ${name}
      </td>
      <td>
        ${contact}
      </td>
      <td>
        ${note}
      </td>
      <td class="actions">
        <a href="#" data-action="edit">edit</a> |
        <a href="#" data-action="delete">delete</a>
      </td>
    `
    }
})

//saveForm.onclick= function () {
    //location.href = "products.html"
    const arr = document.getElementsByName('amt');
    let tot=2;
    for(let i=0;i<arr.length;i++){
        if(parseInt(arr[i].value))
            tot += parseInt(arr[i].value);
    }
    document.getElementById('total').value = tot;


//}

