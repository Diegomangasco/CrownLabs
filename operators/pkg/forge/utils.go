// Copyright 2020-2021 Politecnico di Torino
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package forge

import (
	"strings"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"

	clv1alpha2 "github.com/netgroup-polito/CrownLabs/operators/api/v1alpha2"
)

const (
	// StringSeparator -> the separator used to concatenate string.
	StringSeparator = "-"
)

// ObjectMeta returns the namespace/name pair given an instance object.
func ObjectMeta(instance *clv1alpha2.Instance) metav1.ObjectMeta {
	return metav1.ObjectMeta{
		Name:      canonicalName(instance.GetName()),
		Namespace: instance.GetNamespace(),
	}
}

// ObjectMetaWithSuffix returns the namespace/name pair given an instance object and a name suffix.
func ObjectMetaWithSuffix(instance *clv1alpha2.Instance, suffix string) metav1.ObjectMeta {
	return metav1.ObjectMeta{
		Name:      canonicalName(instance.GetName()) + StringSeparator + suffix,
		Namespace: instance.GetNamespace(),
	}
}

// NamespacedName returns the namespace/name pair given an instance object.
func NamespacedName(instance *clv1alpha2.Instance) types.NamespacedName {
	return types.NamespacedName{
		Name:      canonicalName(instance.GetName()),
		Namespace: instance.GetNamespace(),
	}
}

// NamespacedNameWithSuffix returns the namespace/name pair given an instance object and a name suffix.
func NamespacedNameWithSuffix(instance *clv1alpha2.Instance, suffix string) types.NamespacedName {
	return types.NamespacedName{
		Name:      canonicalName(instance.GetName()) + StringSeparator + suffix,
		Namespace: instance.GetNamespace(),
	}
}

// NamespacedNameToObjectMeta returns the ObjectMeta corresponding to a NamespacedName.
func NamespacedNameToObjectMeta(namespacedName types.NamespacedName) metav1.ObjectMeta {
	return metav1.ObjectMeta{
		Name:      namespacedName.Name,
		Namespace: namespacedName.Namespace,
	}
}

// canonicalName returns a canonical name given a resource name, to
// prevent issues with DNS style requirements.
func canonicalName(name string) string {
	return strings.ReplaceAll(name, ".", StringSeparator)
}