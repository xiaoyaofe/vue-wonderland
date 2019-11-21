## 一、申请接口

协议://域名:端口号： http://172.16.10.124:8191

`url：/oa-server/approval/application`

请求方式:POST

applicationType：1、请休假申请  2、加班申请  3、补签到申请  4、新员工入职申请  5、离职申请

6、人员需求申请  7、出差申请  8、采购申请  9、新旧电脑置换申请  10、名片制作申请  11、固定资产处置申请

12、用印申请  13、文印资质借用申请



#### 新员工入职申请：

请求参数：

|        变量名         | 变量值 | 必须 |                             说明                             |
| :-------------------: | :----: | :--: | :----------------------------------------------------------: |
|    applicationType    |  int   |  是  |                         申请类型：4                          |
|        userId         | String |  是  |                         申请人用户id                         |
|       companyId       |  int   |  是  |                 公司id 0=逍遥盛世，1=昊立信                  |
|      userNameCn       | String |  否  |                        入职人员中文名                        |
|      userNameEn       | String |  否  |                        入职人员英文名                        |
|    departmentName     | String |  否  |                           部门名称                           |
|       position        | String |  否  |                             职位                             |
| businessTutorUserName | String |  否  |                        业务导师用户名                        |
|   spervisorUserName   | String |  否  |                        汇报上级用户名                        |
|       entryDate       | String |  否  |                           入职日期                           |
|    employeeNumber     | String |  否  |                           员工工号                           |
| computerConfiguration |  int   |  是  | 电脑配置 1: 普通电脑标配 2: 美术电脑+手写板 3: 普通电脑标配+固态硬盘 4: 内外网双机 |
|   isOfficeSupplies    |  int   |  是  |             是否准备办公用品 0: 未准备 1：已准备             |



返回参数：

| 变量名  | 变量值 |       说明        |
| :-----: | :----: | :---------------: |
|  code   |  int   | 200成功，其他失败 |
| message | String |     描述信息      |

例如：

```json
{
  "code": 200,
  "message": "success"
}
```



#### 离职申请：



#### 人员需求申请：

请求参数：

|       变量名        | 变量值 | 必须 |             说明              |
| :-----------------: | :----: | :--: | :---------------------------: |
|   applicationType   |  int   |  是  |          申请类型：6          |
|    departmentId     | String |  是  |          需求部门Id           |
|       userId        | String |  是  |         申请人用户id          |
|   applicationDate   | String |  是  |    申请日期 列：2019-09-09    |
|      position       | String |  是  |           需求岗位            |
|   positionNumber    |  int   |  是  |           需求人数            |
|     arrivalDate     | String |  是  |  需求到岗日期 列：2019-10-01  |
|     fixedPeople     |  int   |  是  |         岗位定编人数          |
|    alreadyPeople    |  int   |  是  |         岗位现有人数          |
|     demandCause     | String |  是  |       需求原因（暂定）        |
| jobResponsibilities | String |  是  |           工作职责            |
|   qualifications    | String |  是  |           任职资格            |
|         age         |  int   |  否  |             年龄              |
|      education      | String |  否  |             学历              |
|     profession      | String |  否  |             专业              |
|       gender        |  int   |  否  | 性别： 0=不限，1=男性，2=女性 |
| specialRequirements | String |  否  |           特殊要求            |
|     salaryRange     | String |  是  | 建议薪资范围 列：10000,15000  |



返回参数：

| 变量名  | 变量值 |       说明        |
| :-----: | :----: | :---------------: |
|  code   |  int   | 200成功，其他失败 |
| message | String |     描述信息      |

例如：

```json
{
  "code": 200,
  "message": "success"
}
```



#### 出差申请：

请求参数：

|          变量名           | 变量值 | 必须 |                  说明                  |
| :-----------------------: | :----: | :--: | :------------------------------------: |
|      applicationType      |  int   |  是  |              申请类型：7               |
|       departmentId        | String |  是  |                 部门Id                 |
|          userId           | String |  是  |              申请人用户id              |
|      applicationDate      | String |  是  |        申请日期 列：2019-09-09         |
|         position          | String |  是  |                  职务                  |
|      travelLocation       |  int   |  是  |        出差地点：0=国内，1=国外        |
|          country          | String |  是  |                  国家                  |
|           city            | String |  否  |                  城市                  |
|        travelCause        | String |  是  |                出差事由                |
|     agencyTransaction     | String |  是  |                代理事务                |
|      positionProxyId      | String |  是  |              职务代理人Id              |
|    travelTimeEstimate     | String |  是  | 出差预估时间 列：2019-01-01,2019-01-05 |
|        travelDays         |  int   |  是  |              出差合计天数              |
|          mealFee          | String |  是  |                  餐费                  |
|     transportationFee     | String |  是  |                 交通费                 |
|     accommodationFee      | String |  是  |                 住宿费                 |
|   entertainmentExpenses   | String |  否  |                 应酬费                 |
|         otherFee          | String |  否  |                其他费用                |
|         totalCost         | String |  是  |                合计费用                |
|     visaApplicantName     | String |  否  |             签证申请人名称             |
| visaHouseholdRegistration | String |  否  |               签证人户籍               |
|       residenceTime       | String |  否  | 预计停留时间 列：2019-01-01,2019-01-05 |
|   passportIssuingPlace    | String |  否  |               护照签发地               |
|      passportNumber       | String |  否  |                护照号码                |
|        visaCountry        | String |  否  |               需签证国家               |
|         visaType          |  int   |  否  |        签证类型 0=商务，1=旅行         |



返回参数：

| 变量名  | 变量值 |       说明        |
| :-----: | :----: | :---------------: |
|  code   |  int   | 200成功，其他失败 |
| message | String |     描述信息      |

例如：

```json
{
  "code": 200,
  "message": "success"
}
```



#### 采购申请：

请求参数：

|      变量名       | 变量值 | 必须 |                             说明                             |
| :---------------: | :----: | :--: | :----------------------------------------------------------: |
|  applicationType  |  int   |  是  |                         申请类型：8                          |
|     companyId     |  int   |  是  |                 公司id 0=逍遥盛世，1=昊立信                  |
|  documentNumber   | String |  是  |                           单据编号                           |
|   departmentId    | String |  是  |                          需求部门Id                          |
|      userId       | String |  是  |                         申请人用户id                         |
|  applicationDate  | String |  是  |                   申请日期 列：2019-09-09                    |
|    projectType    |  int   |  是  |                需求项目类型 0=其他 1=公共项目                |
|   purchaseType    |  int   |  是  | 采购类型 0=办公用品 1=日常用品 2=IT设备（键盘、鼠标、显卡、硬盘、显示器等） 3=办公电脑、笔记本电脑 4=测试服务器、渲染服务器 5=测试手机 6=电子产品（平板等） 7=外包服务 8=装修工程 9=其他 |
|     itemType      |  int   |  是  |                    物品类型（同采购类型）                    |
| itemConfiguration |   是   |  是  |                          型号/配置                           |
| requiredQuantity  |  int   |  是  |                           需求数量                           |
|  budgetUnitPrice  | String |  是  |                           预算单价                           |
|    totalBudget    | String |  是  |                           预算总额                           |
|    arrivalDate    | String |  是  |                 计划到货日期 列：2019-10-01                  |
|  purchasePurpose  | String |  是  |                           采购目的                           |



返回参数：

| 变量名  | 变量值 |       说明        |
| :-----: | :----: | :---------------: |
|  code   |  int   | 200成功，其他失败 |
| message | String |     描述信息      |

例如：

```json
{
  "code": 200,
  "message": "success"
}
```



#### 新旧电脑置换申请：





#### 名片制作申请：  



#### 固定资产处置申请：  



#### 用印申请：



#### 文印资质借用申请：





## 二、根据流水号查询申请详细信息

`url：/oa-server/approval/applicationDetailInfo`

请求方式:POST

请求参数：

|    变量名    | 变量值 | 必须 |  说明  |
| :----------: | :----: | :--: | :----: |
| serialNumber | String |  是  | 流水号 |

返回参数：

| 变量名  | 变量值 |       说明        |
| :-----: | :----: | :---------------: |
|  code   |  int   | 200成功，其他失败 |
| message | String |     描述信息      |
|  data   | object |                   |

例如：

```json
请休假申请：
{
  "code": 200,
  "message": "success",
  "data": {
    "applicationDetailInfo": {
      "serialNumber": "XY502240708",					//流水号
      "employeeNumber": "6059",							//员工工号
      "userId": "zhangsan",								//用户id
      "userName": "张三",								  //用户名
      "departmentId": "1487015696",						//部门id
      "departmentName": "移动平台服务端开发组",			 //部门名称
      "position": "java开发工程师",						//职务
      "applicationDate": "2019-02-13",					//提交申请日期
      "leaveType": "2",								   //假期类型
      "reason": "test test test",						//请休假原因
      "handover": "交接",								  //交接事项
      "positionProxyId": "lisi",						//职务代理人id
      "positionProxyName": "李四",					   //职务代理人名称
      "startTime": "2019-02-13 09:30:00",				 //请假开始时间
      "endTime": "2019-02-13 18:30:00",					 //请假结束时间
      "duration": 1,									//请假时长 单位：h
      "createTime": "2019-02-15 14:30:40"
    }
  }
}

加班申请：
{
  "code": 200,
  "message": "success",
  "data": {
    "applicationDetailInfo": {
      "serialNumber": "XY502240708",			//流水号
      "userId": "zhangsan",
      "departmentId": "1487015696",				//部门id
      "applicationDate": "2019-02-13",			//申请时间
      "reason": "",							  //申请事由
      "startTime": "2019-02-13 09:30:00",		//加班开始时间
      "endTime": "2019-02-13 18:30:00",			//加班结束时间
      "duration": 1,						   //加班时长  单位：h
      "createTime": "2019-02-15 14:30:40"
    }
  }
}

补签到申请：
{
  "code": 200,
  "message": "success",
  "data": {
    "applicationDetailInfo": {
      "serialNumber": "XY502240708",					//流水号
      "userId": "zhangsan",							   //用户id
      "departmentId": "1487015696",						//部门id
      "checkInDate": "2019-08-19,2019-08-20",			 //需要补签日期
      "checkInType": "1,1",								//补签类型
      "timeSlot": "1,2",								//补签时段
      "reason": "补签",								  //补签原因
      "createTime": "2019-02-15 14:30:40"
    }
  }
}

新员工入职申请：
{
  "code": 200,
  "message": "success",
  "data": {
    "applicationDetailInfo": {
      "serialNumber": "XY502240708",				 //流水号
      "userId": "zhangsan",							//发起人用户id
      "company_id": 1,								//公司id
      "user_name_cn": "新人",						   //入职人员中文名
      "user_name_en": "xinren",						//入职人员英文名
      "department_name": "新部门",					  //部门名称
      "position": "职务",							  //职位
      "business_tutor_user_name": "李四",			   //业务导师用户名
      "spervisor_user_name": "王五",				   //汇报上级用户名
      "entry_date": "2019-02-13",					//入职日期
      "employee_number": "12512411",				//员工工号
      "computer_configuration": 1,					//电脑配置
      "is_office_supplies": 1,						//是否准备办公用品
      "annex_path": "http://www.baidu.com",			 //附件路径
      "createTime": "2019-02-15 14:30:40"
    }
  }
}

离职申请：


人员需求申请：
{
  "code": 200,
  "message": "success",
  "data": {
    "applicationDetailInfo": {
      "serialNumber": "XY502240708",				 // 流水号
      "userId": "zhangsan",							// 申请人用户id
      "applicationDate": "2019-01-01",				 // 申请日期
      "position": "java开发工程师",					// 需求岗位
      "positionNumber": 2,							// 需求人数
      "arrivalDate": "2019-10-10",					// 需求到岗日期
      "fixedPeople": 3,								// 岗位定编人数
      "alreadyPeople": 3,							// 岗位现有人数
      "demandCause": "test test test",				 // 需求原因（暂定）
      "jobResponsibilities": "测试",				   // 工作职责
      "qualifications": "xxx",						// 任职资格
      "age": 20,								   // 年龄
      "education": "本科",						  // 学历
      "profession": "搬砖",						  // 专业
      "gender": 0,								   // 性别
      "specialRequirements": "",					// 特殊要求
      "salaryRange": "10000,15000",					// 建议薪资范围
      "createTime": "2019-02-15 14:30:40"
    }
  }
}

出差申请：
{
  "code": 200,
  "message": "success",
  "data": {
    "applicationDetailInfo": {
      "serialNumber": "XY502240708",					//流水号
      "userId": "zhangsan",								//用户id
      "departmentId": "1487015696",						//部门id
      "applicationDate": "2019-09-09",					//申请日期
      "position": "java开发工程师",						//职务
      "travelLocation": 1,							   //出差地点
      "country": "xxx",								   //国家
      "city": "test test test",							//城市
      "travelCause": "看猴",							  //出差事由
      "agencyTransaction": "搬砖",					  //代理事务
      "positionProxyId": "zhangsan",					 //代理人用户id
      "travelTimeEstimate": "2019-01-01,2019-01-05",	 //出差预估时间
      "travelDays": 5,								  //出差合计天数
      "mealFee": "200",								  //餐费
      "transportationFee": "500",						//交通费
      "accommodationFee": "1000",						//住宿费
      "entertainmentExpenses": "1000",					//应酬费
      "otherFee": "2000",							  //其他费用
      "totalCost": "10000",							  //合计费用
      "visaApplicantName": "lisi",					   //签证申请人名称
      "visaHouseholdRegistration": "xx",			   //签证人户籍
      "residenceTime": "2019-01-01,2019-01-05",			//预计停留时间
      "passportIssuingPlace": "xx",						//护照签发地
      "passportNumber": "daxxxxx",						//护照号码
      "visaCountry": "美国",							 //需签证国家
      "visaType": 0,								  //签证类型
      "createTime": "2019-02-15 14:30:40",
    }
  }
}

采购申请：

```

