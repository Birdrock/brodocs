

-----------
# PersistentVolumeClaimStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeClaimStatus







PersistentVolumeClaimStatus is the current status of a persistent volume claim.

<aside class="notice">
Appears In <a href="#persistentvolumeclaim-v1">PersistentVolumeClaim</a> </aside>

Field        | Description
------------ | -----------
accessModes <br /> string array | AccessModes contains the actual access modes the volume backing the PVC has. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#access-modes-1
capacity <br /> object | Represents the actual resources of the underlying volume.
phase <br /> string | Phase represents the current phase of PersistentVolumeClaim.





## <strong>Write Operations</strong>

See supported operations below...

## Replace

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



replace status of the specified PersistentVolumeClaim

### HTTP Request

`PUT /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name <br />  | name of the PersistentVolumeClaim
namespace <br />  | object name and auth scope, such as for teams and projects
pretty <br />  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> [PersistentVolumeClaim](#persistentvolumeclaim-v1) | 

### Response

Code         | Description
------------ | -----------
200 <br /> [PersistentVolumeClaim](#persistentvolumeclaim-v1) | OK


## Patch

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



partially update status of the specified PersistentVolumeClaim

### HTTP Request

`PATCH /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name <br />  | name of the PersistentVolumeClaim
namespace <br />  | object name and auth scope, such as for teams and projects
pretty <br />  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> [Patch](#patch-unversioned) | 

### Response

Code         | Description
------------ | -----------
200 <br /> [PersistentVolumeClaim](#persistentvolumeclaim-v1) | OK



## <strong>Read Operations</strong>

See supported operations below...

## Read

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



read status of the specified PersistentVolumeClaim

### HTTP Request

`GET /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name <br />  | name of the PersistentVolumeClaim
namespace <br />  | object name and auth scope, such as for teams and projects
pretty <br />  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> [PersistentVolumeClaim](#persistentvolumeclaim-v1) | OK




