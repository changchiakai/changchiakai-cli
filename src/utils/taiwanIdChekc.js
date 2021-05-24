function test(id) {
  tab = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
  A1 = new Array(
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3
  );
  A2 = new Array(
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    1,
    2,
    3,
    4,
    5
  );
  Mx = new Array(9, 8, 7, 6, 5, 4, 3, 2, 1, 1);

  if (id.length != 10) return false;

  i = tab.indexOf(id.charAt(0));
  if (i == -1) return false;
  sum = A1[i] + A2[i] * 9;

  for (i = 1; i < 10; i++) {
    v = parseInt(id.charAt(i));
    if (isNaN(v)) return false;
    sum = sum + v * Mx[i];
  }
  if (sum % 10 != 0) return false;
  return true;
}
// const a = test();
// console.log("a:", a);

function checkData(idno) {
  //   var idno = "A810000014";
  idno = idno.toUpperCase();

  var a = /^[A-Z]{1}[1-2,8-9]{1}[0-9]{8}$/;
  // console.log("!a.test(idno):", !a.test(idno));
  if (!a.test(idno)) {
    // console.log("error");

    return false;
  }
  let b = test(idno);
  if (!b) {
    // console.log("錯誤");

    return false;
  } else {
    console.log("正確id:   " + idno);
  }
}

// for (let index = 0; index < 9; index++) {
//   for (let index2 = 0; index2 < 9; index2++) {
//     checkData("A8104400" + index + index2);
//   }
// }

function newTest(id) {
  const localTitle = /^[A-Z]{1}[1-2]{1}/;
  const foreignTitle = /^[A-Z]{1}[A-D]{1}/;
  const userIdTitle = id.slice(0, 2);

  const tab = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
  const A1 = new Array(
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3
  );
  const A2 = new Array(
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    1,
    2,
    3,
    4,
    5
  );
  const Mx = new Array(9, 8, 7, 6, 5, 4, 3, 2, 1, 1);
  console.log("id.length", id.length);
  if (id.length !== 10) {
    return { wrongAns4: true };
  }

  // 本國人
  if (localTitle.test(userIdTitle)) {
    let i = tab.indexOf(id.charAt(0));
    if (i === -1) {
      return { wrongAns3: true };
    }

    let sum = A1[i] + A2[i] * 9;

    for (i = 1; i < 10; i++) {
      const v = parseInt(id.charAt(i), 10);
      if (isNaN(v)) {
        return { wrongAns1: true };
      }
      sum = sum + v * Mx[i];
    }

    if (sum % 10 !== 0) {
      return { wrongAns2: true };
    }
    return null;
  }
}

const b = newTest("A800000014");
console.log("b", b);
